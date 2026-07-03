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
  const [stage, setStage] = useState<"ask" | "feedback" | "thanks">("ask");
  const [thanksVia, setThanksVia] = useState<"google" | "private">("private");
  const [feedback, setFeedback] = useState("");
  const [dismissed, setDismissed] = useState(false);

  // Persist that this order was already handled so we don't ask again on refresh.
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

  const leaveGoogleReview = () => {
    markDone();
    window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
    setThanksVia("google");
    setStage("thanks");
  };

  const sendFeedback = () => {
    const subject = `Café Delight order #${orderId} — feedback`;
    const body =
      `Customer: ${customerName}\n` +
      `Order: #${orderId}\n\n` +
      `${feedback || "(no message)"}\n`;
    const mailto = `mailto:${feedbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    markDone();
    window.location.href = mailto;
    setThanksVia("private");
    setStage("thanks");
  };

  if (dismissed) return null;

  if (stage === "thanks") {
    return (
      <div className="mt-6 rounded-2xl bg-cream-2/50 border border-espresso/10 p-5 text-center">
        <div className="text-2xl">🙏</div>
        <div className="font-medium text-espresso mt-1">Thank you!</div>
        <p className="text-sm text-espresso/70 mt-1">
          {thanksVia === "google"
            ? "We appreciate you taking a moment to leave a review."
            : "We read every message and use it to get better."}
        </p>
      </div>
    );
  }

  if (stage === "feedback") {
    return (
      <div className="mt-6 rounded-2xl bg-cream-2/50 border border-espresso/10 p-5">
        <div className="text-sm text-espresso/70 mb-2">
          Tell us anything — what you loved or what we can do better. It comes
          straight to us.
        </div>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your message (optional)"
          rows={3}
          className="w-full rounded-xl border border-espresso/20 bg-cream px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crema"
        />
        <div className="mt-3 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setStage("ask")}
            className="text-sm rounded-full px-4 py-2 text-espresso/70 hover:text-espresso"
          >
            Back
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
        We&apos;d love to hear from you, {customerName.split(" ")[0]} 😊
      </div>
      <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2">
        <button
          type="button"
          onClick={leaveGoogleReview}
          className="text-sm rounded-full bg-espresso text-cream px-5 py-2.5 font-medium hover:bg-espresso-2"
        >
          Leave a Google review
        </button>
        <button
          type="button"
          onClick={() => setStage("feedback")}
          className="text-sm rounded-full border border-espresso/20 text-espresso px-5 py-2.5 font-medium hover:bg-cream"
        >
          Tell us privately
        </button>
      </div>
    </div>
  );
}
