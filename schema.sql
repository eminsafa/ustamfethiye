-- Ustam Fethiye - D1 semasi
-- npx wrangler d1 execute ustamfethiye --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  locale      TEXT    NOT NULL,
  name        TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  email       TEXT,
  service     TEXT,
  region      TEXT,
  message     TEXT,
  source_page TEXT,
  referrer    TEXT,
  country     TEXT,
  address     TEXT,
  service_other TEXT,
  files       INTEGER NOT NULL DEFAULT 0,
  timing      TEXT,
  property_type TEXT,
  status      TEXT    NOT NULL DEFAULT 'yeni'
);

CREATE INDEX IF NOT EXISTS idx_leads_created ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status  ON leads (status);
