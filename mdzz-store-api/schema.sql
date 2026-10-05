-- Orders table schema for mdzz-store-db D1 database
CREATE TABLE IF NOT EXISTS orders (
  order_id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  total TEXT NOT NULL,
  status TEXT NOT NULL,
  customer_name TEXT,
  customer_contact TEXT,
  payment_method TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
