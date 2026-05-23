export const config = {
  mockMode: process.env.MOCK_MODE !== "false",
  businessName: process.env.BUSINESS_NAME ?? "Café Delight",
  businessAddress:
    process.env.BUSINESS_ADDRESS ?? "9395 Crown Crest Blvd, Parker, CO 80138",
  businessPhone: process.env.BUSINESS_PHONE ?? "",
  pickupEtaMinutes: Number(process.env.PICKUP_ETA_MINUTES ?? 12),
  adminPassword: process.env.ADMIN_PASSWORD ?? "letmein",
  clover: {
    merchantId: process.env.CLOVER_MERCHANT_ID ?? "",
    apiToken: process.env.CLOVER_API_TOKEN ?? "",
    environment: process.env.CLOVER_ENVIRONMENT ?? "sandbox",
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? "",
    authToken: process.env.TWILIO_AUTH_TOKEN ?? "",
    fromNumber: process.env.TWILIO_FROM_NUMBER ?? "",
  },
};
