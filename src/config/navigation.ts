export const FEED_TABS = [
  { id: "following", label: "Following", href: "/" },
  { id: "discover", label: "Discover", href: "/discover" },
] as const;

export type FeedTabId = (typeof FEED_TABS)[number]["id"];
