import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/layouts/app-shell";
import { BRAND } from "@/config/brand";
import { LivePresaleFeed } from "@/features/presales/components/live-presale-feed";

export const metadata: Metadata = {
  title: `Discover | ${BRAND.name}`,
};

export default function Discover() {
  return (
    <AppShell activeFeed="discover">
      <Suspense
        fallback={
          <p role="status" className="text-sm">
            Checking presales...
          </p>
        }
      >
        <LivePresaleFeed />
      </Suspense>
    </AppShell>
  );
}
