// Day 5 starter — k6 load test for GET /claims/search (CoverNest sandbox).
// Run one fixed user level per run:   k6 run -e VUS=10 load/search-load.js
// Fill in every TODO. Keep the script in your repo; your EOD evidence is the k6 summary output of each run.
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:4030';
const VUS = Number(__ENV.VUS || 1);

export const options = {
  // TODO 1: stages built from VUS — ramp 0 -> VUS over 10s, hold VUS for 60s, ramp down over 5s.
  stages: [],
  // TODO 2: thresholds from the README performance requirement (p95 and error rate).
  thresholds: {},
};

export function setup() {
  const res = http.post(`${BASE}/login`, JSON.stringify({ username: 'dan.csr', password: 'Train1ng!' }), {
    headers: { 'Content-Type': 'application/json' },
  });
  return { token: res.json('token') };
}

export default function (data) {
  const params = { headers: { Authorization: `Bearer ${data.token}` } };
  // TODO 3: vary the search term across iterations (e.g. water, fire, stolen, CL-7003) so you are not measuring one cached path.
  const res = http.get(`${BASE}/claims/search?q=water`, params);
  // TODO 4: checks — status is 200, and the body has a count field.
  check(res, {});
  // Think time between 0.5 and 1.5 s. Real adjusters do not click in lockstep; a fixed sleep(1)
  // makes virtual users fall into an even rhythm that hides queueing. Keep this line as it is.
  sleep(0.5 + Math.random());
}
