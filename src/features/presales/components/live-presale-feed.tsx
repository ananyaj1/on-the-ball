import Link from "next/link";

import type { FeedTabId } from "@/config/navigation";

import { PRESALE_FEED_STATUS } from "../constants/presale-feed";
import { getFollowedArtistKeys } from "../data/followed-artists";
import { getTicketmasterPresales } from "../data/ticketmaster-presales";
import type { PresaleFeed as PresaleFeedData } from "../types/presale-feed";
import { filterFollowedPresales } from "../utils/artist-follows";
import { PresaleFeed } from "./presale-feed";

export async function LivePresaleFeed({
  variant = "discover",
}: Readonly<{ variant?: FeedTabId }>) {
  const followedArtistKeys = await getFollowedArtistKeys();
  const following = variant === "following";
  const feed: PresaleFeedData =
    following && followedArtistKeys.length === 0
      ? { status: PRESALE_FEED_STATUS.ready, presales: [] }
      : await getTicketmasterPresales();
  const visibleFeed =
    following && feed.status === PRESALE_FEED_STATUS.ready
      ? {
          ...feed,
          presales: filterFollowedPresales(feed.presales, followedArtistKeys),
        }
      : feed;

  return (
    <PresaleFeed
      feed={visibleFeed}
      variant={variant}
      followedArtistKeys={followedArtistKeys}
      emptyMessage={
        following && feed.status === PRESALE_FEED_STATUS.ready
          ? followedArtistKeys.length === 0
            ? "Follow artists in Discover to see their presales here."
            : "No upcoming presales from your artists. Check back soon."
          : undefined
      }
      emptyAction={
        following ? (
          <Link href="/discover">
            Explore NYC presales <span aria-hidden="true">↗</span>
          </Link>
        ) : undefined
      }
    />
  );
}
