import type { Presale } from "./presale";

export type PresaleFeed =
  | Readonly<{ status: "ready"; presales: readonly Presale[] }>
  | Readonly<{
      status: "not-configured" | "unavailable";
      presales: readonly [];
    }>;
