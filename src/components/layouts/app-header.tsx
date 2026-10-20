import { EightBallIcon } from "@/components/ui/eight-ball-icon";
import { PlaidStrip } from "@/components/ui/plaid-strip";
import { BRAND } from "@/config/brand";
import { fraunces } from "@/config/fonts";
import type { FeedTabId } from "@/config/navigation";

import { FeedTabs } from "./feed-tabs";
import styles from "./app-header.module.css";

type AppHeaderProps = Readonly<{
  activeFeed: FeedTabId;
}>;

export function AppHeader({ activeFeed }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <h1
          className={`${fraunces.className} flex items-center gap-1 whitespace-nowrap text-wordmark leading-none tracking-[-0.03em]`}
        >
          <EightBallIcon />
          <span>{BRAND.name}</span>
        </h1>
      </div>
      <div className={styles.plaidRow}>
        <PlaidStrip />
        <div className={styles.tabRow}>
          <FeedTabs activeFeed={activeFeed} />
        </div>
      </div>
    </header>
  );
}
