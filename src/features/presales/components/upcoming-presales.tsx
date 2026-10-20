import { useId } from "react";
import Image from "next/image";

import { EightBallIcon } from "@/components/ui/eight-ball-icon";
import { SplitUnderline } from "@/components/ui/split-underline";
import { fraunces } from "@/config/fonts";

import type { Presale } from "../types/presale";
import { formatPresaleSchedule } from "../utils/format-presale-schedule";
import { getArtistFollowKey } from "../utils/artist-follows";

import { FollowArtistButton } from "./follow-artist-button";
import styles from "./upcoming-presales.module.css";
import { PresaleCalendarDate } from "./presale-calendar-date";

type UpcomingPresalesProps = Readonly<{
  presales: readonly Presale[];
  showDivider?: boolean;
  followedArtistKeys?: readonly string[];
}>;

export function UpcomingPresales({
  presales,
  showDivider = true,
  followedArtistKeys = [],
}: UpcomingPresalesProps) {
  const headingId = useId();

  if (presales.length === 0) return null;

  return (
    <section
      aria-labelledby={headingId}
      className={`${styles.section} ${showDivider ? styles.withDivider : ""}`}
    >
      <div className={styles.heading}>
        <h2 id={headingId} className={styles.title}>
          Coming up
        </h2>
        <p className={styles.count}>
          {presales.length} {presales.length === 1 ? "presale" : "presales"}
        </p>
      </div>
      <ul className={styles.list}>
        {presales.map((presale) => (
          <UpcomingPresaleRow
            key={
              presale.eventId ??
              `${presale.artistName}-${presale.startsAt}-${presale.venueName}`
            }
            presale={presale}
            isFollowing={followedArtistKeys.includes(
              getArtistFollowKey(presale),
            )}
          />
        ))}
      </ul>
    </section>
  );
}

type UpcomingPresaleRowProps = Readonly<{
  presale: Presale;
  isFollowing: boolean;
}>;

function UpcomingPresaleRow({ presale, isFollowing }: UpcomingPresaleRowProps) {
  const { timeLabel, timeZoneLabel } = formatPresaleSchedule(presale);

  return (
    <li className={styles.row}>
      <span className={styles.portrait}>
        {presale.artistImageUrl ? (
          <Image
            src={presale.artistImageUrl}
            alt=""
            width={64}
            height={64}
            sizes="64px"
            className={styles.photo}
          />
        ) : (
          <EightBallIcon />
        )}
      </span>
      <div className={styles.event}>
        <h3 className={`${fraunces.className} ${styles.artist}`}>
          <a
            href={presale.presaleUrl ?? presale.artistUrl}
            className={styles.artistLink}
          >
            <SplitUnderline>{presale.artistName}</SplitUnderline>
          </a>
        </h3>
        <p className={styles.location}>
          {presale.venueName}, {presale.city}
        </p>
        <time dateTime={presale.startsAt} className={styles.schedule}>
          {timeLabel} {timeZoneLabel}
        </time>
        <FollowArtistButton
          artistKey={getArtistFollowKey(presale)}
          artistName={presale.artistName}
          isFollowing={isFollowing}
        />
      </div>
      <PresaleCalendarDate startsAt={presale.startsAt} />
    </li>
  );
}
