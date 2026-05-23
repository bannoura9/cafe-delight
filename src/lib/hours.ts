type Window = { open: number; close: number };

// Day index: 0=Sun, 1=Mon ... 6=Sat
const HOURS: Record<number, Window | null> = {
  0: null,
  1: { open: 7, close: 15 },
  2: { open: 7, close: 15 },
  3: { open: 7, close: 15 },
  4: { open: 7, close: 15 },
  5: { open: 7, close: 15 },
  6: null,
};

const TZ = process.env.BUSINESS_TIMEZONE ?? "America/Denver";
const DAY_NAME_TO_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export function isOpenNow(now: Date = new Date()): boolean {
  if (process.env.BYPASS_HOURS === "true") return true;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Sun";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);

  const day = DAY_NAME_TO_INDEX[weekday] ?? 0;
  const w = HOURS[day];
  if (!w) return false;

  const localHour = hour + minute / 60;
  return localHour >= w.open && localHour < w.close;
}

export function hoursLabel(): string {
  return "Mon–Fri 7 AM – 3 PM · Sat & Sun closed";
}
