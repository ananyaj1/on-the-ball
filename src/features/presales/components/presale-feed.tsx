import type { ReactNode } from "react";

import type { FeedTabId } from "@/config/navigation";

import type { PresaleFeed as PresaleFeedData } from "../types/presale-feed";
import { getPresaleFeedView } from "../utils/get-presale-feed-view";

import { NextPresale } from "./next-presale";
import styles from "./presale-feed.module.css";
import { UpcomingPresales } from "./upcoming-presales";

type PresaleFeedProps = Readonly<{
  feed: PresaleFeedData;
  variant: FeedTabId;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  followedArtistKeys?: readonly string[];
}>;

export function PresaleFeed({
  feed,
  variant,
  emptyMessage,
  emptyAction,
  followedArtistKeys = [],
}: PresaleFeedProps) {
  const featured = variant === "following";
  const view = getPresaleFeedView(feed, { featured });

  return (
    <>
      {featured && (
        <NextPresale
          presale={view.next}
          followedArtistKeys={followedArtistKeys}
        />
      )}
      {view.upcoming ? (
        <UpcomingPresales
          presales={view.upcoming}
          showDivider={featured}
          followedArtistKeys={followedArtistKeys}
        />
      ) : (
        <div className={styles.empty}>
          <p role="status">{emptyMessage ?? view.emptyMessage}</p>
          {emptyAction}
        </div>
      )}
    </>
  );
}
