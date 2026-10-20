import { Suspense, useId } from "react";

import { MagicEightBall } from "@/components/ui/magic-eight-ball";
import { SplitUnderline } from "@/components/ui/split-underline";
import { fraunces } from "@/config/fonts";

import type { Presale } from "../types/presale";
import { getArtistFollowKey } from "../utils/artist-follows";

import { FollowArtistButton } from "./follow-artist-button";
import styles from "./next-presale.module.css";
import { PresaleCountdown } from "./presale-countdown";
import { PresaleFortune } from "./presale-fortune";
import { PresaleInfoCard } from "./presale-info-card";

type NextPresaleProps = Readonly<{
  presale: Presale | null;
  followedArtistKeys?: readonly string[];
}>;

export function NextPresale({
  presale,
  followedArtistKeys = [],
}: NextPresaleProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={presale ? headingId : undefined}
      aria-label={presale ? undefined : "Presale outlook"}
      className={`${styles.section} ${presale ? "" : styles.empty}`}
    >
      <Suspense fallback={<MagicEightBall saying="" />}>
        <PresaleFortune hasPresale={presale !== null} />
      </Suspense>
      {presale && (
        <PresaleDetails
          presale={presale}
          headingId={headingId}
          isFollowing={followedArtistKeys.includes(getArtistFollowKey(presale))}
        />
      )}
      {presale && (
        <div className={styles.countdown}>
          <PresaleCountdown startsAt={presale.startsAt} />
        </div>
      )}
    </section>
  );
}

type PresaleDetailsProps = Readonly<{
  presale: Presale;
  headingId: string;
  isFollowing: boolean;
}>;

function PresaleDetails({
  presale,
  headingId,
  isFollowing,
}: PresaleDetailsProps) {
  const ticketUrl = presale.presaleUrl ?? presale.artistUrl;
  return (
    <div className={styles.event}>
      <p className={styles.eyebrow}>upcoming...</p>
      <h2 id={headingId} className={`${fraunces.className} ${styles.artist}`}>
        <a href={ticketUrl} className={styles.artistLink}>
          <SplitUnderline>{presale.artistName}</SplitUnderline>{" "}
          <span aria-hidden="true" className={styles.arrow}>
            ↗
          </span>
        </a>
      </h2>
      <PresaleInfoCard
        venueName={presale.venueName}
        city={presale.city}
        startsAt={presale.startsAt}
      />
      <FollowArtistButton
        artistKey={getArtistFollowKey(presale)}
        artistName={presale.artistName}
        isFollowing={isFollowing}
      />
    </div>
  );
}
