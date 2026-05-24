import { isOpenNow, hoursLabel, nextOpenLabel, currentTimeLabel } from "@/lib/hours";

export function OpenStatusBar() {
  const open = isOpenNow();
  const now = new Date();

  return (
    <div
      className={`w-full text-xs sm:text-sm py-1.5 px-4 flex items-center justify-center gap-3 ${
        open
          ? "bg-leaf/15 text-leaf border-b border-leaf/20"
          : "bg-red-50 text-red-700 border-b border-red-200"
      }`}
    >
      <span className="flex items-center gap-1.5 font-medium">
        <span
          aria-hidden
          className={`inline-block w-2 h-2 rounded-full ${
            open ? "bg-leaf" : "bg-red-500"
          }`}
        />
        {open ? "Open now" : "Closed"}
      </span>
      <span className="opacity-70 hidden sm:inline">·</span>
      <span className="opacity-80">
        {open ? hoursLabel() : nextOpenLabel(now)}
      </span>
      <span className="opacity-70 hidden md:inline">·</span>
      <span className="opacity-60 hidden md:inline">
        {currentTimeLabel(now)}
      </span>
    </div>
  );
}
