const CLOCK_TIME = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

export function normalizeClockTime(value: string): string {
  const match = value.trim().match(CLOCK_TIME);
  if (!match) return "";

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return "";

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatThaiServiceDate(value: string): string {
  if (!value) return "-";

  const dateOnly = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  const date = dateOnly
    ? new Date(`${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}T12:00:00+07:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(date);
}

export function formatThaiServiceTime(value: string): string {
  if (!value) return "-";

  const clock = normalizeClockTime(value);
  if (clock) {
    const [hour, minute] = clock.split(":");
    return `${hour}.${minute} น.`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const formatted = new Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  }).format(date);

  return `${formatted.replace(":", ".")} น.`;
}
