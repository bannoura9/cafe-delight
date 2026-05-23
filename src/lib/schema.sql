CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  clover_order_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  subtotal_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL,
  tip_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('received','preparing','ready','completed')) DEFAULT 'received',
  created_at BIGINT NOT NULL,
  ready_at BIGINT,
  notified_at BIGINT
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  menu_item_id TEXT NOT NULL,
  name TEXT NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  modifiers JSONB NOT NULL DEFAULT '[]'::jsonb,
  line_total_cents INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS sms_log (
  id SERIAL PRIMARY KEY,
  to_number TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at BIGINT NOT NULL,
  status TEXT NOT NULL,
  error TEXT
);

CREATE INDEX IF NOT EXISTS sms_log_sent_at_idx ON sms_log (sent_at DESC);
