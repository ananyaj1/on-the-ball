import { createHash } from "node:crypto";

import type { Presale } from "../types/presale";

export const FOLLOWING_COOKIE = "on-the-ball-following";
const ARTIST_KEY_PATTERN = /^(tm:[A-Za-z0-9_-]{1,100}|name:[a-f0-9]{64})$/;
const MAX_COOKIE_BYTES = 3500;

export function getArtistFollowKey(
  artist: Pick<Presale, "artistId" | "artistName">,
): string {
  if (artist.artistId && ARTIST_KEY_PATTERN.test(`tm:${artist.artistId}`)) {
    return `tm:${artist.artistId}`;
  }

  const name = artist.artistName
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  return `name:${createHash("sha256").update(name).digest("hex")}`;
}

export function parseFollowedArtistKeys(value: string | undefined): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return [
      ...new Set(
        parsed.filter(
          (key): key is string =>
            typeof key === "string" && ARTIST_KEY_PATTERN.test(key),
        ),
      ),
    ];
  } catch {
    return [];
  }
}

export function updateFollowedArtistKeys(
  current: readonly string[],
  artistKey: string,
  follow: boolean,
): string[] {
  if (!ARTIST_KEY_PATTERN.test(artistKey))
    throw new TypeError("Invalid artist.");

  const next = new Set(current);
  if (follow) next.add(artistKey);
  else next.delete(artistKey);
  const keys = [...next];
  if (encodeURIComponent(JSON.stringify(keys)).length > MAX_COOKIE_BYTES) {
    throw new RangeError("Follow list is full.");
  }
  return keys;
}

export function filterFollowedPresales(
  presales: readonly Presale[],
  artistKeys: readonly string[],
): Presale[] {
  const followed = new Set(artistKeys);
  return presales.filter((presale) =>
    followed.has(getArtistFollowKey(presale)),
  );
}
