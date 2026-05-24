"use client";

import { useEffect, useState } from "react";

type Props = {
  orderId: string;
  customerName: string;
  feedbackEmail: string;
  googleReviewUrl: string;
};

export function ReviewPrompt({
  orderId,
  customerName,
  feedbackEmail,
  googleReviewUrl,
}: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [stage, setStage] = useState<"ask" | "feedback" | "thanks">("ask");
  const [feedback, setFeedback] = useState("");
  const [dismissed, setDismissed] = useState(false);

  // Persist that this order was already rated so we don't ask again on refresh.
  useEffect(() => {
    const key = `cd-reviewed:${orderId}`;
    if (typeof window !== "undefined" && window.localStorage.getItem(key)) {
      setDismissed(true);
    }
  }, [orderId]);

  const markDone = () => {
    try {
      window.localStorage.setItem(`cd-reviewed:${orderId}`, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  const onRate = (n: number) => {
    setRating(n);
    if (n === 5) {
      // 5-star path → send straight to Google review
      markDone();
      window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
      setStage("thanks");
    } else {
      // 1-4 stars → ask for feedback we can address privately
      setStage("feedback");
    }
  };

  const sendFeedback = () => {
    const subject = `Café Delight order #${orderId} — ${rating} star feedback`;
    const body =
      `Customer: ${customerName}\n` +
      `Order: #${orderId}\n` +
      `Rating: ${rating} / 5\n\n` +
      `${feedback || "(no message)"}\n`;
    const mailto = `mailto:${feedbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    markDone();
    window.location.href = mailto;
    setStage("thanks");
  };

  if (dismissed) return null;

  if (stage === "thanks") {
    return (
      <div className="mt-6 rounded-2xl bg-cream-2/50 border border-espresso/10 p-5 text-center">
        <div className="text-2xl">🙏</div>
        <div className="font-medium text-espresso mt-1">Thank you!</div>
        <p className="text-sm text-espresso/70 mt-1">
          {rating === 5
            ? "We sincerely appreciate the kind word."
            : "We read every message and use it to get better."}
        </p>
      </div>
    );
  }

  if (stage === "feedback") {
    return (
      <div className="mt-6 rounded-2xl bg-cream-2/50 border border-espresso/10 p-5">
        <div className="text-sm text-espresso/70 mb-2">
          You rated us <strong>{rating} / 5</strong>. Tell us what we can do
          better — we&apos;ll fix it.
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="What could've been better? (optional)"
          rows={3}
          className="w-full rounded-xl border border-espresso/20 bg-cream px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crema"
        />
        <div className="mt-3 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              markDone();
              setDismissed(true);
            }}
            className="text-sm rounded-full px-4 py-2 text-espresso/70 hover:text-espresso"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={sendFeedback}
            className="text-sm rounded-full bg-espresso text-cream px-4 py-2 font-medium hover:bg-espresso-2"
          >
            Send feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl bg-cream-2/50 border border-espresso/10 p-5 text-center">
      <div className="font-medium text-espresso">How was your experience?</div>
      <div className="text-sm text-espresso/70 mt-1">
        Your feedback helps {customerName.split(" ")[0]} 😉
      </div>
      <div className="mt-3 flex justify-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = (hover ?? rating ?? 0) >= n;
          return (
            <button
              key={n}
              type="button"
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onRate(n)}
              className={`text-3xl transition-transform hover:scale-110 ${
                filled ? "text-crema-2" : "text-espresso/20"
              }`}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              ★
            </button>
          );
        })}
      </div>
    </div>
  );
}
