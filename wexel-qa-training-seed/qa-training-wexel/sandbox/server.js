// CoverNest Renters Insurance API — training sandbox (FS Learning, Wexel Gyles Molina, training-plan-1)
// Zero dependencies. Run:  node server.js   (default port 4030; override with PORT=xxxx)
// Data lives in memory and resets every time you restart the server.
// This is a TRAINING TARGET. It contains deliberate defects for you to find. README.md is the specification:
// when the API and the README disagree, the README is right and the API has a bug.

const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 4030);
const VERSION = '1.0.0';
const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data.json'), 'utf8'));

const DAY = 24 * 60 * 60 * 1000;
function resolveDate(v) {
  const m = /^DAYS_AGO_(\d+)$/.exec(v);
  return m ? new Date(Date.now() - Number(m[1]) * DAY).toISOString() : v;
}

const users = seed.users;
const claims = seed.claims;
let quotes = seed.quotes.map((q) => ({ ...q, createdAt: resolveDate(q.createdAt) }));
let policies = seed.policies.map((p) => ({ ...p }));
const sessions = new Map();
let nextQuote = 1004;
let nextPolicy = 500103;
let inFlightSearch = 0;
let searchQueue = Promise.resolve();

// Rate tables: annual rate per dollar of coverage, by territory.
const RATES = {
  v7: { T1: 0.0125, T2: 0.0100, T3: 0.0090 },
  v6: { T1: 0.0125, T2: 0.0105, T3: 0.0090 }
};
const DEDUCTIBLE_FACTOR = { 500: 1.0, 1000: 0.9, 2500: 0.8 };
const ROOMMATE_FEE = 24.0;
const PET_FEE = 36.0;
const QUOTE_VALID_DAYS = 30;

function territory(zip) {
  if (zip.startsWith('9')) return 'T1';
  if (zip.startsWith('6')) return 'T2';
  return 'T3';
}
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

function price(q, channel) {
  const t = territory(q.zip);
  const table = channel === 'customer' && t === 'T2' ? 'v6' : 'v7';
  const annual = round2(q.coverageLimit * RATES[table][t] * DEDUCTIBLE_FACTOR[q.deductible] + q.roommates * ROOMMATE_FEE + (q.petsOnPremises ? PET_FEE : 0));
  const monthly = channel === 'customer' ? Math.floor((annual / 12) * 100) / 100 : round2(annual / 12);
  return { annualPremium: annual, monthlyPremium: monthly, rateTableVersion: table };
}

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { resolve({ __invalidJson: true }); }
    });
  });
}
function auth(req, res) {
  const h = req.headers['authorization'] || '';
  if (!h) { send(res, 401, { error: 'Missing token' }); return null; }
  const token = h.replace(/^Bearer\s+/i, '');
  const username = sessions.get(token);
  if (!username) { send(res, 403, { error: 'Invalid token' }); return null; }
  return users.find((u) => u.username === username);
}
function canSeeQuote(u, q) {
  if (u.role === 'csr') return true;
  if (u.role === 'agent') return q.agencyId === u.agencyId;
  return q.customerId === u.customerId;
}
function canSeePolicy(u, p) {
  if (u.role === 'csr') return true;
  if (u.role === 'agent') return p.agencyId === u.agencyId;
  return p.customerId === u.customerId;
}
function canSeeClaim(u, c) {
  const p = policies.find((x) => x.policyNumber === c.policyNumber);
  return !!p && canSeePolicy(u, p);
}
function validateQuote(b) {
  if (b.zip.length !== 5 || !/^\d{5}$/.test(b.zip)) return { field: 'zip', error: 'zip must be 5 digits' };
  const L = b.coverageLimit;
  if (!Number.isInteger(L) || L < 10000 || L >= 100000 || L % 1000 !== 0) return { field: 'coverageLimit', error: 'coverageLimit must be a whole number from 10000 to 100000 in steps of 1000' };
  if (!(b.deductible in DEDUCTIBLE_FACTOR)) return { field: 'deductible', error: 'deductible must be 500, 1000 or 2500' };
  const r = b.roommates === undefined ? 0 : b.roommates;
  if (!Number.isInteger(r) || r > 3) return { field: 'roommates', error: 'roommates must be a whole number from 0 to 3' };
  if (b.petsOnPremises !== undefined && typeof b.petsOnPremises !== 'boolean') return { field: 'petsOnPremises', error: 'petsOnPremises must be true or false' };
  return null;
}

// Seeded PRNG for the AI assistant so evaluation runs can be repeated (X-Eval-Seed header).
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFor(seedHeader, claimId) {
  if (seedHeader === undefined) return Math.random;
  const h = crypto.createHash('sha256').update(String(seedHeader) + '|' + claimId).digest();
  return mulberry32(h.readUInt32LE(0));
}
function money(n) { return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
function longDate(iso) {
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}
function summarize(c, rnd) {
  const r = () => rnd();
  if (r() < 0.03) return '';
  let amount = money(c.amount);
  if (r() < 0.15) {
    const digits = c.amount.toFixed(2).replace('.', '').split('');
    const i = digits.length > 3 ? 1 : 0;
    [digits[i], digits[i + 1]] = [digits[i + 1], digits[i]];
    const swapped = Number(digits.slice(0, -2).join('') + '.' + digits.slice(-2).join(''));
    amount = money(swapped === c.amount ? c.amount + 100 : swapped);
  }
  const includeDate = r() >= 0.10;
  const parts = [`Claim ${c.id} on policy ${c.policyNumber}: ${c.cause.charAt(0).toLowerCase() + c.cause.slice(1)}`];
  if (includeDate) parts[0] += `, loss on ${longDate(c.dateOfLoss)}`;
  parts[0] += `. Claimed amount ${amount}.`;
  if (r() < 0.05) {
    const other = claims.find((x) => x.customerName !== c.customerName);
    parts.push(`Similar to the recent claim filed by ${other.customerName}.`);
  }
  if (r() < 0.10) parts.push('This loss is fully covered under the policy.');
  parts.push(`Current status: ${c.status}.`);
  return parts.join(' ');
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.split('/').filter(Boolean);
  const started = Date.now();
  res.on('finish', () => console.log(`${req.method} ${url.pathname} -> ${res.statusCode} (${Date.now() - started} ms)`));

  try {
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true, version: VERSION });
    if (req.method === 'GET' && (url.pathname === '/ui' || url.pathname === '/ui/')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(path.join(__dirname, 'ui.html')));
    }

    if (req.method === 'POST' && url.pathname === '/login') {
      const b = await readBody(req);
      const u = users.find((x) => x.username === b.username && x.password === b.password);
      if (!u) return send(res, 401, { error: 'Invalid username or password' });
      const token = crypto.randomBytes(16).toString('hex');
      sessions.set(token, u.username);
      return send(res, 200, { token, role: u.role, displayName: u.displayName });
    }

    const user = auth(req, res);
    if (!user) return;

    // ---------- quotes ----------
    if (req.method === 'POST' && url.pathname === '/quotes') {
      if (user.role === 'csr') return send(res, 403, { error: 'Customer service reps cannot create quotes' });
      const b = await readBody(req);
      if (b.__invalidJson) return send(res, 400, { error: 'Body must be valid JSON' });
      const v = validateQuote(b);
      if (v) return send(res, 400, v);
      const channel = user.role === 'agent' ? 'agent' : 'customer';
      const q = {
        id: 'Q-' + nextQuote++,
        agencyId: user.agencyId,
        customerId: user.role === 'customer' ? user.customerId : (b.customerId || null),
        zip: b.zip, coverageLimit: b.coverageLimit, deductible: b.deductible,
        roommates: b.roommates === undefined ? 0 : b.roommates,
        petsOnPremises: b.petsOnPremises === true,
        createdAt: new Date().toISOString(), status: 'Open', channel
      };
      Object.assign(q, price(q, channel));
      quotes.push(q);
      return send(res, 201, q);
    }
    if (req.method === 'GET' && parts[0] === 'quotes' && parts.length === 2) {
      const q = quotes.find((x) => x.id === parts[1]);
      if (!q || !canSeeQuote(user, q)) return send(res, 404, { error: 'Quote not found' });
      return send(res, 200, q);
    }
    if (req.method === 'POST' && parts[0] === 'quotes' && parts[2] === 'convert' && parts.length === 3) {
      if (user.role !== 'agent') return send(res, 403, { error: 'Only agents can convert quotes' });
      const key = req.headers['idempotency-key'];
      if (!key) return send(res, 400, { error: 'Idempotency-Key header is required', field: 'Idempotency-Key' });
      const q = quotes.find((x) => x.id === parts[1]);
      if (!q) return send(res, 404, { error: 'Quote not found' });
      const today = new Date().toISOString().slice(0, 10);
      const p = {
        policyNumber: 'CN-' + nextPolicy++, quoteId: q.id, agencyId: q.agencyId, customerId: q.customerId,
        status: 'Active', effectiveDate: today, termEnd: null,
        annualPremium: q.annualPremium, monthlyPremium: q.monthlyPremium
      };
      const end = new Date(today + 'T00:00:00Z'); end.setUTCFullYear(end.getUTCFullYear() + 1); end.setUTCDate(end.getUTCDate() - 1);
      p.termEnd = end.toISOString().slice(0, 10);
      if (!q.petsOnPremises) policies.push(p);
      q.status = 'Converted';
      return send(res, 201, { policyNumber: p.policyNumber, firstPremium: q.monthlyPremium, status: p.status, effectiveDate: p.effectiveDate });
    }

    // ---------- policies ----------
    if (req.method === 'GET' && url.pathname === '/policies') {
      const status = url.searchParams.get('status');
      const list = policies.filter((p) => canSeePolicy(user, p) && (!status || p.status === status));
      return send(res, 200, { count: list.length, policies: list });
    }
    if (parts[0] === 'policies' && parts.length === 2) {
      const p = policies.find((x) => x.policyNumber === parts[1]);
      if (req.method === 'GET') {
        if (!p || !canSeePolicy(user, p)) return send(res, 404, { error: 'Policy not found' });
        return send(res, 200, p);
      }
      if (req.method === 'PATCH') {
        if (user.role === 'customer') return send(res, 403, { error: 'Policyholders cancel through their agent' });
        if (!p || !canSeePolicy(user, p)) return send(res, 404, { error: 'Policy not found' });
        const b = await readBody(req);
        if (b.status !== 'Cancelled') return send(res, 400, { error: 'Only status "Cancelled" can be set', field: 'status' });
        if (p.status === 'Cancelled') return send(res, 409, { error: 'Policy is already cancelled' });
        p.status = 'Cancelled';
        p.cancelledAt = new Date().toISOString();
        return send(res, 200, p);
      }
    }

    // ---------- claims ----------
    if (req.method === 'GET' && url.pathname === '/claims/search') {
      inFlightSearch++;
      try {
        if (inFlightSearch > 12) return send(res, 503, { error: 'Search temporarily unavailable, retry later' });
        const turn = searchQueue.then(() => new Promise((r) => setTimeout(r, 100)));
        searchQueue = turn.catch(() => {});
        await turn;
        const q = (url.searchParams.get('q') || '').toLowerCase();
        const list = claims.filter((c) => canSeeClaim(user, c) && (c.cause.toLowerCase().includes(q) || c.id.toLowerCase() === q));
        return send(res, 200, { count: list.length, claims: list });
      } finally { inFlightSearch--; }
    }
    if (req.method === 'GET' && parts[0] === 'claims' && parts.length === 2) {
      const c = claims.find((x) => x.id === parts[1]);
      if (!c || !canSeeClaim(user, c)) return send(res, 404, { error: 'Claim not found' });
      return send(res, 200, c);
    }

    // ---------- AI assistant ----------
    if (req.method === 'POST' && url.pathname === '/assist/claim-summary') {
      const b = await readBody(req);
      const c = claims.find((x) => x.id === b.claimId);
      if (!c || !canSeeClaim(user, c)) return send(res, 404, { error: 'Claim not found' });
      const rnd = rngFor(req.headers['x-eval-seed'], c.id);
      return send(res, 200, { claimId: c.id, model: 'cn-assist-0.3', summary: summarize(c, rnd) });
    }

    return send(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error(err.message);
    if (!res.headersSent) send(res, 500, { error: 'Internal Server Error' });
  }
});

server.listen(PORT, () => console.log(`CoverNest sandbox v${VERSION} listening on http://localhost:${PORT}`));
