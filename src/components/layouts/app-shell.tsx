import type { ReactNode } from "react";

import type { FeedTabId } from "@/config/navigation";

import { AppHeader } from "./app-header";

type AppShellProps = Readonly<{
  children?: ReactNode;
  activeFeed?: FeedTabId;
}>;

export function AppShell({
  children,
  activeFeed = "following",
}: AppShellProps) {
  return (
    <div className="flex min-h-dvh justify-center bg-surface sm:bg-background sm:px-6 sm:py-6">
      <div className="flex h-dvh w-full min-w-0 flex-col overflow-hidden bg-surface sm:h-[calc(100dvh-3rem)] sm:max-w-[26.25rem] sm:rounded-3xl sm:border sm:border-foreground sm:shadow-[6px_6px_0_var(--color-shadow)]">
        <AppHeader activeFeed={activeFeed} />
        <main
          tabIndex={0}
          aria-label="Presale feed"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain px-6 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-foreground"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
