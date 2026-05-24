export const config = {
  mockMode: process.env.MOCK_MODE !== "false",
  businessName: process.env.BUSINESS_NAME ?? "Café Delight",
  businessAddress:
    process.env.BUSINESS_ADDRESS ?? "9395 Crown Crest Blvd, Parker, CO 80138",
  businessPhone: process.env.BUSINESS_PHONE ?? "",
  pickupEtaMinutes: Number(process.env.PICKUP_ETA_MINUTES ?? 5),
  taxRate: Number(process.env.TAX_RATE ?? 0.08),
  adminPassword: process.env.ADMIN_PASSWORD ?? "letmein",
  clover: {
    merchantId: process.env.CLOVER_MERCHANT_ID ?? "",
    apiToken: process.env.CLOVER_API_TOKEN ?? "",
    environment: process.env.CLOVER_ENVIRONMENT ?? "sandbox",
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY ?? "",
    fromEmail: process.env.RESEND_FROM_EMAIL ?? "",
  },
  feedbackEmail: process.env.FEEDBACK_EMAIL ?? "cafedelightco@gmail.com",
  googleReviewUrl:
    process.env.GOOGLE_REVIEW_URL ??
    "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9+Delight+9395+Crown+Crest+Blvd+Parker+CO",
};
