import { formatPresaleSchedule } from "../utils/format-presale-schedule";

import styles from "./presale-calendar-date.module.css";

type PresaleCalendarDateProps = Readonly<{
  startsAt: string;
  className?: string;
}>;

export function PresaleCalendarDate({
  startsAt,
  className,
}: PresaleCalendarDateProps) {
  const { dayLabel, monthLabel } = formatPresaleSchedule({
    startsAt,
  });

  return (
    <time
      dateTime={startsAt}
      className={`${styles.calendar} ${className ?? ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="60"
        viewBox="0 0 48 60"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={styles.outline}
      >
        <rect x="0.5" y="3.5" width="47" height="56" stroke="currentColor" />
        <path d="M0.5 13.5H47.5M12 0V7M36 0V7" stroke="currentColor" />
      </svg>
      <span className={styles.day}>{dayLabel}</span>
      <span className={styles.month}>{monthLabel}</span>
    </time>
  );
}
