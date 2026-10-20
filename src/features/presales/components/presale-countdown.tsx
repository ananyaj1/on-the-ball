"use client";

import { useSyncExternalStore } from "react";

import { getPresaleCountdown } from "../utils/get-presale-countdown";

import styles from "./presale-countdown.module.css";

const CLOCK_INTERVAL = 1_000;
const COUNTDOWN_UNITS = [
  { key: "days", label: "Days", shortLabel: "d" },
  { key: "hours", label: "Hours", shortLabel: "h" },
  { key: "minutes", label: "Minutes", shortLabel: "m" },
  { key: "seconds", label: "Seconds", shortLabel: "s" },
] as const;

function subscribe(onTick: () => void) {
  const interval = window.setInterval(onTick, CLOCK_INTERVAL);
  return () => window.clearInterval(interval);
}

function getSnapshot() {
  return Math.floor(Date.now() / CLOCK_INTERVAL);
}

function getServerSnapshot() {
  return null;
}

type PresaleCountdownProps = Readonly<{
  startsAt: string;
}>;

export function PresaleCountdown({ startsAt }: PresaleCountdownProps) {
  const now = useSyncExternalStore<number | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const countdown =
    now === null ? null : getPresaleCountdown(startsAt, now * CLOCK_INTERVAL);

  if (countdown?.status === "elapsed") {
    return <p className={styles.note}>Presale open</p>;
  }

  if (countdown?.status === "invalid") {
    return <p className={styles.note}>Time unavailable</p>;
  }

  return (
    <div
      role="timer"
      aria-label="Time until presale"
      aria-live="off"
      aria-busy={countdown === null}
      className={styles.countdown}
    >
      <dl className={styles.units}>
        {COUNTDOWN_UNITS.map(({ key, label, shortLabel }) => (
          <div key={key} className={styles.unit}>
            <dt className={styles.unitLabel}>
              <span className="sr-only">{label}</span>
              <span aria-hidden="true">{shortLabel}</span>
            </dt>
            <dd className={styles.value}>
              {countdown ? String(countdown[key]).padStart(2, "0") : "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
