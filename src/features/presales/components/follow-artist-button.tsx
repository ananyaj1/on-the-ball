"use client";

import { useActionState } from "react";

import { setArtistFollow } from "../actions/set-artist-follow";

import styles from "./follow-artist-button.module.css";

type FollowArtistButtonProps = Readonly<{
  artistKey: string;
  artistName: string;
  isFollowing: boolean;
}>;

export function FollowArtistButton({
  artistKey,
  artistName,
  isFollowing,
}: FollowArtistButtonProps) {
  const [state, action, pending] = useActionState(setArtistFollow, {
    error: null,
  });

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="artistKey" value={artistKey} />
      <input
        type="hidden"
        name="intent"
        value={isFollowing ? "unfollow" : "follow"}
      />
      <button
        type="submit"
        className={styles.button}
        aria-label={`${isFollowing ? "Unfollow" : "Follow"} ${artistName}`}
        aria-pressed={isFollowing}
        disabled={pending}
      >
        <span aria-hidden="true">{isFollowing ? "✓" : "+"}</span>
        {pending ? "saving..." : isFollowing ? "following" : "follow"}
      </button>
      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
    </form>
  );
}
