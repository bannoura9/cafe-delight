import { config } from "./config";
import type { OrderItem } from "./orders";

export type CloverChargeInput = {
  amountCents: number;
  cardToken: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
};

export type CloverChargeResult = {
  cloverOrderId: string;
  cloverPaymentId: string;
  last4: string;
};

export async function chargeAndCreateOrder(
  input: CloverChargeInput,
): Promise<CloverChargeResult> {
  if (config.mockMode) {
    await new Promise((r) => setTimeout(r, 400));
    if (input.cardToken === "tok_fail") {
      throw new Error("Card declined (mock).");
    }
    return {
      cloverOrderId: `mock_order_${Date.now()}`,
      cloverPaymentId: `mock_pmt_${Math.random().toString(36).slice(2, 10)}`,
      last4: input.cardToken.slice(-4) || "4242",
    };
  }

  // Real Clover integration goes here.
  // https://docs.clover.com/docs/ecommerce-api
  throw new Error(
    "Real Clover integration not configured. Set MOCK_MODE=true or add credentials.",
  );
}
