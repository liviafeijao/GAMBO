export function formatDashboardDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((value) => value.type === type)?.value ?? "";

  return `${part("weekday")}, ${part("day")} ${part("month").replace(/\.$/, "")} ${part("year")}`.toLocaleUpperCase(
    "pt-BR",
  );
}
