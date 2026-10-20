"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import {
  FOLLOWING_COOKIE,
  parseFollowedArtistKeys,
  updateFollowedArtistKeys,
} from "../utils/artist-follows";

export type FollowArtistState = Readonly<{ error: string | null }>;

export async function setArtistFollow(
  _previousState: FollowArtistState,
  formData: FormData,
): Promise<FollowArtistState> {
  const artistKey = formData.get("artistKey");
  const intent = formData.get("intent");

  if (
    typeof artistKey !== "string" ||
    !["follow", "unfollow"].includes(String(intent))
  ) {
    return {
      error: "Couldn’t update this artist. Please refresh and try again.",
    };
  }

  try {
    const store = await cookies();
    const current = parseFollowedArtistKeys(store.get(FOLLOWING_COOKIE)?.value);
    const next = updateFollowedArtistKeys(
      current,
      artistKey,
      intent === "follow",
    );
    store.set(FOLLOWING_COOKIE, JSON.stringify(next), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  } catch (error) {
    return {
      error:
        error instanceof RangeError
          ? "Your follow list is full. Unfollow an artist to add another."
          : "Couldn’t save your follows. Please try again.",
    };
  }

  revalidatePath("/");
  revalidatePath("/discover");
  return { error: null };
}
