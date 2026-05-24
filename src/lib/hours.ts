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
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
};
const DAY_INDEX_TO_LONG: Record<number, string> = {
  0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday",
  4: "Thursday", 5: "Friday", 6: "Saturday",
};

function localNow(now: Date) {
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
  return { day: DAY_NAME_TO_INDEX[weekday] ?? 0, hour, minute };
}

export function isOpenNow(now: Date = new Date()): boolean {
  if (process.env.BYPASS_HOURS === "true") return true;
  const { day, hour, minute } = localNow(now);
  const w = HOURS[day];
  if (!w) return false;
  const localHour = hour + minute / 60;
  return localHour >= w.open && localHour < w.close;
}

export function hoursLabel(): string {
  return "Mon–Fri 7 AM – 3 PM · Sat & Sun closed";
}

/**
 * When does the shop next open? Returns a customer-facing label like
 * "Opens Monday at 7 AM" or "Opens at 7 AM today" if it's a weekday morning.
 */
export function nextOpenLabel(now: Date = new Date()): string {
  const { day, hour } = localNow(now);
  const today = HOURS[day];

  // If we're earlier than today's open time, same day
  if (today && hour < today.open) {
    return `Opens at ${formatHour(today.open)} today`;
  }

  // Otherwise scan forward up to 7 days
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const w = HOURS[d];
    if (w) {
      const dayLabel = i === 1 ? "tomorrow" : DAY_INDEX_TO_LONG[d];
      return `Opens ${dayLabel} at ${formatHour(w.open)}`;
    }
  }
  return "Closed";
}

function formatHour(h: number): string {
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${ampm}`;
}

export function currentTimeLabel(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(now);
}
