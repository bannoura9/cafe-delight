import { randomUUID } from "node:crypto";
import { sql } from "./db";

export type OrderItem = {
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  modifiers: { id: string; name: string; priceCents: number }[];
  lineTotalCents: number;
};

export type OrderStatus =
  | "pending_payment"
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  cloverOrderId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  status: OrderStatus;
  createdAt: number;
  paidAt: number | null;
  readyAt: number | null;
  notifiedAt: number | null;
};

type OrderRow = {
  id: string;
  clover_order_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  notes: string | null;
  subtotal_cents: number;
  tax_cents: number;
  tip_cents: number;
  total_cents: number;
  status: OrderStatus;
  created_at: number;
  paid_at: number | null;
  ready_at: number | null;
  notified_at: number | null;
};

type ItemRow = {
  order_id: string;
  position: number;
  menu_item_id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  modifiers: OrderItem["modifiers"];
  line_total_cents: number;
};

function rowToOrder(row: OrderRow, items: OrderItem[]): Order {
  return {
    id: row.id,
    cloverOrderId: row.clover_order_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    notes: row.notes ?? null,
    items,
    subtotalCents: Number(row.subtotal_cents),
    taxCents: Number(row.tax_cents),
    tipCents: Number(row.tip_cents),
    totalCents: Number(row.total_cents),
    status: row.status,
    createdAt: Number(row.created_at),
    paidAt: row.paid_at == null ? null : Number(row.paid_at),
    readyAt: row.ready_at == null ? null : Number(row.ready_at),
    notifiedAt: row.notified_at == null ? null : Number(row.notified_at),
  };
}

export async function createOrder(
  input: Omit<
    Order,
    "id" | "status" | "createdAt" | "paidAt" | "readyAt" | "notifiedAt" | "cloverOrderId"
  > & { cloverOrderId: string | null },
): Promise<Order> {
  const id = randomUUID().slice(0, 8);
  const createdAt = Date.now();

  await sql`
    INSERT INTO orders (
      id, clover_order_id, customer_name, customer_phone, customer_email, notes,
      subtotal_cents, tax_cents, tip_cents, total_cents,
      status, created_at
    ) VALUES (
      ${id}, ${input.cloverOrderId}, ${input.customerName}, ${input.customerPhone}, ${input.customerEmail}, ${input.notes},
      ${input.subtotalCents}, ${input.taxCents}, ${input.tipCents}, ${input.totalCents},
      'pending_payment', ${createdAt}
    )
  `;

  for (let i = 0; i < input.items.length; i++) {
    const it = input.items[i];
    await sql`
      INSERT INTO order_items (
        order_id, position, menu_item_id, name, unit_price_cents,
        quantity, modifiers, line_total_cents
      ) VALUES (
        ${id}, ${i}, ${it.menuItemId}, ${it.name}, ${it.unitPriceCents},
        ${it.quantity}, ${JSON.stringify(it.modifiers)}::jsonb, ${it.lineTotalCents}
      )
    `;
  }

  return {
    id,
    cloverOrderId: input.cloverOrderId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    notes: input.notes,
    items: input.items,
    subtotalCents: input.subtotalCents,
    taxCents: input.taxCents,
    tipCents: input.tipCents,
    totalCents: input.totalCents,
    status: "pending_payment",
    createdAt,
    paidAt: null,
    readyAt: null,
    notifiedAt: null,
  };
}

export async function markEmailSent(id: string): Promise<void> {
  await sql`UPDATE orders SET email_sent_at = ${Date.now()} WHERE id = ${id}`;
}

/**
 * Stash the Clover hosted-checkout session ID on the order so the success
 * route can recover the Clover order even when Clover redirects back with
 * empty query params. Prefixed with `session:` so it never collides with a
 * real Clover order ID. Overwritten by `markOrderPaid` once payment lands.
 */
export async function setCheckoutSession(
  id: string,
  sessionId: string,
): Promise<void> {
  await sql`
    UPDATE orders
    SET clover_order_id = ${"session:" + sessionId}
    WHERE id = ${id} AND status = 'pending_payment'
  `;
}

export async function markOrderPaid(
  id: string,
  cloverOrderId: string,
  cloverPaymentId: string,
): Promise<void> {
  await sql`
    UPDATE orders
    SET status = 'received',
        clover_order_id = ${cloverOrderId},
        clover_payment_id = ${cloverPaymentId},
        paid_at = ${Date.now()}
    WHERE id = ${id} AND status = 'pending_payment'
  `;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  const rows = (await sql`SELECT * FROM orders WHERE id = ${id} LIMIT 1`) as OrderRow[];
  if (rows.length === 0) return undefined;
  const itemRows = (await sql`
    SELECT * FROM order_items WHERE order_id = ${id} ORDER BY position ASC
  `) as ItemRow[];
  const items: OrderItem[] = itemRows.map((r) => ({
    menuItemId: r.menu_item_id,
    name: r.name,
    unitPriceCents: Number(r.unit_price_cents),
    quantity: Number(r.quantity),
    modifiers: r.modifiers,
    lineTotalCents: Number(r.line_total_cents),
  }));
  return rowToOrder(rows[0], items);
}

export async function listOrders(): Promise<Order[]> {
  const orderRows = (await sql`
    SELECT * FROM orders ORDER BY created_at DESC LIMIT 100
  `) as OrderRow[];
  if (orderRows.length === 0) return [];

  const ids = orderRows.map((r) => r.id);
  const itemRows = (await sql`
    SELECT * FROM order_items WHERE order_id = ANY(${ids}::text[]) ORDER BY position ASC
  `) as ItemRow[];

  const itemsByOrder = new Map<string, OrderItem[]>();
  for (const r of itemRows) {
    const list = itemsByOrder.get(r.order_id) ?? [];
    list.push({
      menuItemId: r.menu_item_id,
      name: r.name,
      unitPriceCents: Number(r.unit_price_cents),
      quantity: Number(r.quantity),
      modifiers: r.modifiers,
      lineTotalCents: Number(r.line_total_cents),
    });
    itemsByOrder.set(r.order_id, list);
  }

  return orderRows.map((r) => rowToOrder(r, itemsByOrder.get(r.id) ?? []));
}

export async function setOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | undefined> {
  if (status === "ready") {
    await sql`
      UPDATE orders
      SET status = ${status}, ready_at = COALESCE(ready_at, ${Date.now()})
      WHERE id = ${id}
    `;
  } else {
    await sql`UPDATE orders SET status = ${status} WHERE id = ${id}`;
  }
  return getOrder(id);
}

export async function markNotified(id: string): Promise<void> {
  await sql`UPDATE orders SET notified_at = ${Date.now()} WHERE id = ${id}`;
}
