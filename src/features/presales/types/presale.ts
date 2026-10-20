export type Presale = Readonly<{
  eventId?: string;
  artistId?: string;
  artistName: string;
  city: string;
  venueName: string;
  presaleName: string;
  startsAt: string;
  timeZone: string;
  artistUrl: `https://www.ticketmaster.com/${string}`;
  artistImageUrl?: `https://s1.ticketm.net/dam/${string}`;
  presaleUrl?: `https://www.ticketmaster.com/${string}`;
}>;
