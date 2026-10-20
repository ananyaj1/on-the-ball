import Link from "next/link";

import { SplitUnderline } from "@/components/ui/split-underline";
import { FEED_TABS, type FeedTabId } from "@/config/navigation";

import styles from "./feed-tabs.module.css";

type FeedTabsProps = Readonly<{
  activeFeed: FeedTabId;
}>;

export function FeedTabs({ activeFeed }: FeedTabsProps) {
  return (
    <nav aria-label="Presale feeds" className={styles.tabs}>
      {FEED_TABS.map(({ id, label, href }) => (
        <Link
          key={id}
          href={href}
          aria-current={activeFeed === id ? "page" : undefined}
          className={styles.tab}
        >
          <span aria-hidden="true" className={styles.perforation} />
          <SplitUnderline>{label}</SplitUnderline>
        </Link>
      ))}
    </nav>
  );
}
