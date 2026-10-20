import { Suspense } from "react";

import { AppShell } from "@/components/layouts/app-shell";
import { LivePresaleFeed } from "@/features/presales/components/live-presale-feed";

export default function Home() {
  return (
    <AppShell activeFeed="following">
      <Suspense
        fallback={
          <p role="status" className="text-sm">
            Checking your artists...
          </p>
        }
      >
        <LivePresaleFeed variant="following" />
      </Suspense>
    </AppShell>
  );
}
