type Window = { open: number; close: number };
const HOURS: Record<number, Window | null> = {
  0: { open: 7, close: 14 },
  1: { open: 6, close: 18 },
  2: { open: 6, close: 18 },
  3: { open: 6, close: 18 },
  4: { open: 6, close: 18 },
  5: { open: 6, close: 19 },
  6: { open: 7, close: 19 },
};

export function isOpenNow(now: Date = new Date()): boolean {
  const w = HOURS[now.getDay()];
  if (!w) return false;
  const hour = now.getHours() + now.getMinutes() / 60;
  return hour >= w.open && hour < w.close;
}

export function hoursLabel(): string {
  return "Mon–Fri 6a–6p · Sat 7a–7p · Sun 7a–2p";
}
