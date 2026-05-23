import { randomUUID } from "node:crypto";

export type OrderItem = {
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  modifiers: { id: string; name: string; priceCents: number }[];
  lineTotalCents: number;
};

export type Order = {
  id: string;
  cloverOrderId: string | null;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotalCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  status: "received" | "preparing" | "ready" | "completed";
  createdAt: number;
  readyAt: number | null;
  notifiedAt: number | null;
};

declare global {
  // eslint-disable-next-line no-var
  var __cafeDelightOrders: Map<string, Order> | undefined;
}

const store: Map<string, Order> =
  globalThis.__cafeDelightOrders ?? new Map<string, Order>();
globalThis.__cafeDelightOrders = store;

export function createOrder(
  input: Omit<
    Order,
    "id" | "status" | "createdAt" | "readyAt" | "notifiedAt" | "cloverOrderId"
  > & { cloverOrderId: string | null },
): Order {
  const id = randomUUID().slice(0, 8);
  const order: Order = {
    id,
    cloverOrderId: input.cloverOrderId,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    items: input.items,
    subtotalCents: input.subtotalCents,
    taxCents: input.taxCents,
    tipCents: input.tipCents,
    totalCents: input.totalCents,
    status: "received",
    createdAt: Date.now(),
    readyAt: null,
    notifiedAt: null,
  };
  store.set(id, order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return store.get(id);
}

export function listOrders(): Order[] {
  return Array.from(store.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function setOrderStatus(id: string, status: Order["status"]): Order | undefined {
  const order = store.get(id);
  if (!order) return undefined;
  order.status = status;
  if (status === "ready" && !order.readyAt) order.readyAt = Date.now();
  return order;
}

export function markNotified(id: string): void {
  const order = store.get(id);
  if (order) order.notifiedAt = Date.now();
}
