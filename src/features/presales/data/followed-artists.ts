import "server-only";

import { cookies } from "next/headers";

import {
  FOLLOWING_COOKIE,
  parseFollowedArtistKeys,
} from "../utils/artist-follows";

export async function getFollowedArtistKeys(): Promise<string[]> {
  const store = await cookies();
  return parseFollowedArtistKeys(store.get(FOLLOWING_COOKIE)?.value);
}
