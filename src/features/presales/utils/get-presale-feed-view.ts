import {
  PRESALE_FEED_MESSAGES,
  PRESALE_FEED_STATUS,
} from "../constants/presale-feed";
import type { PresaleFeed } from "../types/presale-feed";

export function getPresaleFeedView(
  feed: PresaleFeed,
  { featured = true }: Readonly<{ featured?: boolean }> = {},
) {
  const [next, ...upcoming] = feed.presales;
  const hasUpcomingPresales =
    feed.status === PRESALE_FEED_STATUS.ready && next !== undefined;

  return {
    next: featured ? (next ?? null) : null,
    upcoming: hasUpcomingPresales
      ? featured
        ? upcoming
        : feed.presales
      : null,
    emptyMessage: hasUpcomingPresales
      ? null
      : PRESALE_FEED_MESSAGES[feed.status],
  } as const;
}
