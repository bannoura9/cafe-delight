import Link from "next/link";

export default async function PaymentFailedPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ reason?: string }>;
}) {
  const { id } = await params;
  const { reason } = await searchParams;

  // "unconfirmed" means the customer finished Clover checkout but we couldn't
  // verify the charge — they may well have paid, so don't send them back to
  // pay again.
  if (reason === "unconfirmed") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🧾</div>
        <h1 className="display text-3xl text-espresso mb-3">
          We couldn&apos;t confirm your payment
        </h1>
        <p className="text-espresso/70 mb-2">
          Your card may still have been charged. Please don&apos;t pay again —
          show this screen at the counter and we&apos;ll check it right away.
        </p>
        <p className="text-espresso/70 mb-6 font-medium">Order #{id}</p>
        <div className="flex gap-3 justify-center">
          <Link
            href={`/order/${id}`}
            className="rounded-full bg-espresso text-cream px-5 py-2.5 font-medium hover:bg-espresso-2"
          >
            View order status
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-espresso/20 px-5 py-2.5 hover:bg-cream-2"
          >
            Menu
          </Link>
        </div>
      </div>
    );
  }

  const human =
    reason === "not_paid"
      ? "Your payment didn't go through. No charge was made."
      : reason === "order_not_found"
        ? "We couldn't find that order. It may have expired."
        : "Something went wrong with your payment.";

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">😕</div>
      <h1 className="display text-3xl text-espresso mb-3">Payment didn&apos;t complete</h1>
      <p className="text-espresso/70 mb-6">{human}</p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/cart"
          className="rounded-full bg-espresso text-cream px-5 py-2.5 font-medium hover:bg-espresso-2"
        >
          Back to cart
        </Link>
        <Link
          href="/menu"
          className="rounded-full border border-espresso/20 px-5 py-2.5 hover:bg-cream-2"
        >
          Menu
        </Link>
      </div>
      {reason && reason !== "not_paid" && reason !== "order_not_found" ? (
        <details className="mt-8 text-xs text-espresso/70">
          <summary>Technical details</summary>
          <pre className="mt-2 text-left whitespace-pre-wrap">{reason}</pre>
        </details>
      ) : null}
    </div>
  );
}
