import type { Presale } from "../types/presale";
import { formatPresaleSchedule } from "../utils/format-presale-schedule";

import styles from "./presale-info-card.module.css";

type PresaleInfoCardProps = Readonly<
  Pick<Presale, "venueName" | "city" | "startsAt">
>;

export function PresaleInfoCard({
  venueName,
  city,
  startsAt,
}: PresaleInfoCardProps) {
  const { dateLabel, timeLabel, timeZoneLabel } = formatPresaleSchedule({
    startsAt,
  });

  return (
    <div className={styles.details}>
      <p className={styles.location}>
        {venueName}, {city}
      </p>
      <time dateTime={startsAt} className={styles.schedule}>
        <span>{dateLabel}</span>
        <span>
          {timeLabel} {timeZoneLabel}
        </span>
      </time>
    </div>
  );
}
