import { config } from "./config";
import type { OrderItem } from "./orders";

type CloverEnv = "sandbox" | "production";

const CLOVER_BASE: Record<CloverEnv, string> = {
  sandbox: "https://apisandbox.dev.clover.com",
  production: "https://api.clover.com",
};

function env(): CloverEnv {
  return config.clover.environment === "production" ? "production" : "sandbox";
}

function authHeaders() {
  return {
    Authorization: `Bearer ${config.clover.apiToken}`,
    "Content-Type": "application/json",
  };
}

export type CheckoutInput = {
  ourOrderId: string;
  items: OrderItem[];
  taxCents: number;
  tipCents: number;
  customerName: string;
  customerPhone: string;
  successUrl: string;
  cancelUrl: string;
};

export type CheckoutResult = {
  href: string;
  checkoutSessionId: string;
};

/**
 * Create a Clover Hosted Checkout session. Customer is redirected to Clover's
 * hosted payment page, completes payment there, then is redirected back to
 * successUrl. Uses the merchant API token — no separate ecommerce keys needed.
 *
 * Docs: https://docs.clover.com/dev/docs/ecommerce-api-hosted-checkout
 */
export async function createHostedCheckout(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  if (config.mockMode) {
    await new Promise((r) => setTimeout(r, 100));
    return {
      href: `${input.successUrl}?mock=1&orderId=mock_${Date.now()}`,
      checkoutSessionId: `mock_session_${Date.now()}`,
    };
  }

  if (!config.clover.apiToken || !config.clover.merchantId) {
    throw new Error(
      "Clover not configured. Set CLOVER_API_TOKEN and CLOVER_MERCHANT_ID.",
    );
  }

  const lineItems = input.items.map((item) => {
    const modsTotal = item.modifiers.reduce((s, m) => s + m.priceCents, 0);
    const modSuffix =
      item.modifiers.length > 0
        ? ` — ${item.modifiers.map((m) => m.name).join(", ")}`
        : "";
    return {
      name: `${item.name}${modSuffix}`,
      unitQty: item.quantity,
      price: item.unitPriceCents + modsTotal,
    };
  });

  if (input.taxCents > 0) {
    lineItems.push({ name: "Tax", unitQty: 1, price: input.taxCents });
  }
  if (input.tipCents > 0) {
    lineItems.push({ name: "Tip", unitQty: 1, price: input.tipCents });
  }

  const body = {
    customer: {
      firstName: input.customerName.split(" ")[0] || input.customerName,
      lastName: input.customerName.split(" ").slice(1).join(" ") || undefined,
      phoneNumber: input.customerPhone,
    },
    shoppingCart: { lineItems },
    redirectUrls: {
      success: input.successUrl,
      failure: input.cancelUrl,
    },
  };

  const res = await fetch(
    `${CLOVER_BASE[env()]}/invoicingcheckoutservice/v1/checkouts`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
        "X-Clover-Merchant-Id": config.clover.merchantId,
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Clover hosted checkout failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as { href: string; checkoutSessionId: string };
  return data;
}

export type CloverOrderState = "open" | "locked" | "paid" | "manualTransfer" | string;

export type VerifiedPayment = {
  cloverOrderId: string;
  paid: boolean;
  state: CloverOrderState;
  totalCents: number;
  paymentId: string | null;
};

/**
 * Verify a Clover order was actually paid. Called from /order/[id]/success
 * after Clover redirects the customer back.
 */
export async function verifyCloverPayment(
  cloverOrderId: string,
): Promise<VerifiedPayment> {
  if (config.mockMode) {
    return {
      cloverOrderId,
      paid: true,
      state: "paid",
      totalCents: 0,
      paymentId: `mock_pmt_${Date.now()}`,
    };
  }

  const res = await fetch(
    `${CLOVER_BASE[env()]}/v3/merchants/${config.clover.merchantId}/orders/${cloverOrderId}?expand=payments`,
    { headers: authHeaders() },
  );
  if (!res.ok) {
    throw new Error(`Clover order fetch failed (${res.status})`);
  }
  const order = (await res.json()) as {
    state?: string;
    total?: number;
    payments?: { elements?: { id: string; result?: string }[] };
  };

  const payments = order.payments?.elements ?? [];
  const successful = payments.find((p) => p.result === "SUCCESS");

  return {
    cloverOrderId,
    paid: !!successful,
    state: (order.state ?? "unknown") as CloverOrderState,
    totalCents: order.total ?? 0,
    paymentId: successful?.id ?? null,
  };
}

/**
 * Tag the Clover order with customer name + ONLINE marker so the printed
 * ticket and the on-screen order list are obviously online pickup orders,
 * not walk-in register sales.
 */
export async function annotateCloverOrder(
  cloverOrderId: string,
  customerName: string,
  ourOrderId: string,
): Promise<void> {
  if (config.mockMode) return;
  if (!config.clover.apiToken || !config.clover.merchantId) return;

  const title = `ONLINE — ${customerName}`;
  const note = `ONLINE PICKUP ORDER\nCustomer: ${customerName}\nWebsite order #${ourOrderId}`;

  const res = await fetch(
    `${CLOVER_BASE[env()]}/v3/merchants/${config.clover.merchantId}/orders/${cloverOrderId}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ title, note }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[clover] annotate failed (${res.status}): ${text}`);
  }
}

/**
 * Send the Clover order to the merchant's receipt printer(s). Uses the
 * print_event endpoint, which the Station Duo polls and turns into a
 * physical receipt print. Fires-and-forgets — failures are logged but
 * never block the customer's success redirect.
 */
export async function printCloverOrder(cloverOrderId: string): Promise<void> {
  if (config.mockMode) return;
  if (!config.clover.apiToken || !config.clover.merchantId) return;

  const res = await fetch(
    `${CLOVER_BASE[env()]}/v3/merchants/${config.clover.merchantId}/print_event`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        orderRef: { id: cloverOrderId },
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[clover] print_event failed (${res.status}): ${text}`);
  }
}
