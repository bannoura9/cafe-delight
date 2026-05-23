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

export function isOpenNow(now: Date = new Date()): boolean {
  const w = HOURS[now.getDay()];
  if (!w) return false;
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= w.open && hour < w.close;
}

export function hoursLabel(): string {
  return "Mon–Fri 7 AM – 3 PM · Sat & Sun closed";
}
