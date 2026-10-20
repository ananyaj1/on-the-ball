export const PRESALE_FEED_STATUS = {
  ready: "ready",
  notConfigured: "not-configured",
  unavailable: "unavailable",
} as const;

export const PRESALE_FEED_MESSAGES = {
  [PRESALE_FEED_STATUS.ready]:
    "No upcoming presales announced. Check back soon.",
  [PRESALE_FEED_STATUS.notConfigured]: "Live presales aren’t connected yet.",
  [PRESALE_FEED_STATUS.unavailable]:
    "Presales are unavailable right now. Try again shortly.",
} as const;
