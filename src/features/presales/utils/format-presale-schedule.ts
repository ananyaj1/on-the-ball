import { PRESALE_DISPLAY } from "../constants/presale-display";
import type { Presale } from "../types/presale";

type PresaleSchedule = Pick<Presale, "startsAt">;

export function formatPresaleSchedule({ startsAt }: PresaleSchedule) {
  const date = new Date(startsAt);
  const { timeZone, timeZoneLabel } = PRESALE_DISPLAY;
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const dateLabel = dateFormatter.format(date);
  const dateParts = dateFormatter.formatToParts(date);
  const dayLabel = dateParts.find(({ type }) => type === "day")?.value ?? "";
  const monthLabel =
    dateParts.find(({ type }) => type === "month")?.value.toUpperCase() ?? "";
  const timeLabel = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return { dateLabel, dayLabel, monthLabel, timeLabel, timeZoneLabel };
}
