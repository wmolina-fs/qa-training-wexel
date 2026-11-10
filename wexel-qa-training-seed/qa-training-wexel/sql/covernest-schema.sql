-- CoverNest training database schema (SQLite). Timestamps ending in Z are UTC.
CREATE TABLE agencies (id TEXT PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE customers (id INTEGER PRIMARY KEY, full_name TEXT NOT NULL, email TEXT NOT NULL, agency_id TEXT NOT NULL REFERENCES agencies(id));
CREATE TABLE policies (
  id INTEGER PRIMARY KEY, policy_number TEXT NOT NULL UNIQUE, customer_id INTEGER NOT NULL REFERENCES customers(id),
  agency_id TEXT NOT NULL REFERENCES agencies(id), status TEXT NOT NULL,            -- Active | Lapsed | Cancelled | Expired
  effective_date TEXT NOT NULL, term_end TEXT NOT NULL, annual_premium REAL NOT NULL, roommates INTEGER NOT NULL DEFAULT 0,
  cancelled_at_utc TEXT, created_at_utc TEXT NOT NULL, deleted_at_utc TEXT,             -- deleted_at_utc NOT NULL = soft-deleted
  source TEXT NOT NULL DEFAULT 'core');
CREATE TABLE renewals (id INTEGER PRIMARY KEY, policy_id INTEGER NOT NULL REFERENCES policies(id), renewed_at_utc TEXT NOT NULL, new_annual_premium REAL NOT NULL);
CREATE TABLE payments (id INTEGER PRIMARY KEY, policy_id INTEGER NOT NULL REFERENCES policies(id), amount REAL NOT NULL, paid_at_utc TEXT NOT NULL, method TEXT NOT NULL);
CREATE TABLE claims (id INTEGER PRIMARY KEY, policy_id INTEGER NOT NULL REFERENCES policies(id), status TEXT NOT NULL,  -- Open | Paid | Denied
  amount REAL NOT NULL, paid_amount REAL, date_of_loss TEXT NOT NULL, created_at_utc TEXT NOT NULL);
