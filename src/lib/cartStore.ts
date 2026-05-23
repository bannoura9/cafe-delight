"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Modifier } from "./menu";

export type CartLine = {
  lineId: string;
  menuItemId: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  modifiers: Modifier[];
};

type CartState = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "lineId">) => void;
  remove: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  subtotalCents: () => number;
  totalQuantity: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (line) =>
        set((s) => ({
          lines: [
            ...s.lines,
            { ...line, lineId: Math.random().toString(36).slice(2, 10) },
          ],
        })),
      remove: (lineId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),
      setQuantity: (lineId, quantity) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.lineId === lineId
              ? { ...l, quantity: Math.max(1, quantity) }
              : l,
          ),
        })),
      clear: () => set({ lines: [] }),
      subtotalCents: () =>
        get().lines.reduce(
          (sum, l) =>
            sum +
            l.quantity *
              (l.unitPriceCents +
                l.modifiers.reduce((m, mod) => m + mod.priceCents, 0)),
          0,
        ),
      totalQuantity: () => get().lines.reduce((n, l) => n + l.quantity, 0),
    }),
    { name: "cafe-delight-cart" },
  ),
);

export function lineTotalCents(line: CartLine): number {
  return (
    line.quantity *
    (line.unitPriceCents + line.modifiers.reduce((m, mod) => m + mod.priceCents, 0))
  );
}
