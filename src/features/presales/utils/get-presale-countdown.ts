const MILLISECONDS_PER_SECOND = 1_000;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

type PresaleCountdown =
  | Readonly<{
      status: "upcoming";
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }>
  | Readonly<{ status: "elapsed" }>
  | Readonly<{ status: "invalid" }>;

export function getPresaleCountdown(
  startsAt: string,
  now: number,
): PresaleCountdown {
  const deadline = Date.parse(startsAt);

  if (!Number.isFinite(deadline) || !Number.isFinite(now)) {
    return { status: "invalid" };
  }

  const remaining = deadline - now;

  if (remaining <= 0) {
    return { status: "elapsed" };
  }

  const totalSeconds = Math.ceil(remaining / MILLISECONDS_PER_SECOND);

  return {
    status: "upcoming",
    days: Math.floor(totalSeconds / SECONDS_PER_DAY),
    hours: Math.floor((totalSeconds % SECONDS_PER_DAY) / SECONDS_PER_HOUR),
    minutes: Math.floor((totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE),
    seconds: totalSeconds % SECONDS_PER_MINUTE,
  };
}
