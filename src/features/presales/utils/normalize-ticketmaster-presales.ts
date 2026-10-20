import type { Presale } from "../types/presale";
import type {
  TicketmasterEvent,
  TicketmasterImage,
} from "../types/ticketmaster";

const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const TICKETMASTER_HOSTNAMES = new Set([
  "ticketmaster.com",
  "www.ticketmaster.com",
]);
const TICKETMASTER_IMAGE_HOSTNAME = "s1.ticketm.net";
const TICKETMASTER_IMAGE_PATH_PREFIX = "/dam/";
const MINIMUM_IMAGE_DIMENSION = 128;
const CANCELED_EVENT_CODES = new Set(["canceled", "postponed"]);
const DEFAULT_TIME_ZONE = "America/New_York";
const DEFAULT_PRESALE_NAME = "Presale";

type TicketmasterPresale = NonNullable<
  NonNullable<TicketmasterEvent["sales"]>["presales"]
>[number];

type TicketmasterImageCandidate = TicketmasterImage & {
  url: NonNullable<Presale["artistImageUrl"]>;
  width: number;
  height: number;
};

function ticketUrl(
  value: string | undefined,
): Presale["artistUrl"] | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (
      !HTTP_PROTOCOLS.has(url.protocol) ||
      !TICKETMASTER_HOSTNAMES.has(url.hostname) ||
      url.username ||
      url.password ||
      url.port
    ) {
      return undefined;
    }

    url.protocol = "https:";
    url.hostname = "www.ticketmaster.com";
    return url.href as Presale["artistUrl"];
  } catch {
    return undefined;
  }
}

function artistImage(
  images: readonly TicketmasterImage[],
): Presale["artistImageUrl"] | undefined {
  const candidates: TicketmasterImageCandidate[] = images.flatMap((image) => {
    const { url: imageUrl, width, height, fallback } = image;
    if (!imageUrl || width == null || height == null || fallback) return [];

    try {
      const url = new URL(imageUrl);
      if (
        !HTTP_PROTOCOLS.has(url.protocol) ||
        url.hostname !== TICKETMASTER_IMAGE_HOSTNAME ||
        !url.pathname.startsWith(TICKETMASTER_IMAGE_PATH_PREFIX) ||
        url.search ||
        url.username ||
        url.password ||
        url.port
      ) {
        return [];
      }

      url.protocol = "https:";
      return [
        {
          ...image,
          url: url.href as NonNullable<Presale["artistImageUrl"]>,
          width,
          height,
        },
      ];
    } catch {
      return [];
    }
  });

  candidates.sort((a, b) => {
    const aSmall =
      a.width < MINIMUM_IMAGE_DIMENSION || a.height < MINIMUM_IMAGE_DIMENSION;
    const bSmall =
      b.width < MINIMUM_IMAGE_DIMENSION || b.height < MINIMUM_IMAGE_DIMENSION;
    if (aSmall !== bSmall) return aSmall ? 1 : -1;

    const ratioDifference =
      Math.abs(a.width / a.height - 1) - Math.abs(b.width / b.height - 1);
    return ratioDifference || a.width - b.width;
  });

  return candidates.at(0)?.url;
}

function findNextPresale(
  presales: readonly TicketmasterPresale[] | undefined,
  now: number,
): TicketmasterPresale | undefined {
  return presales
    ?.map((presale) => ({
      presale,
      start: Date.parse(presale.startDateTime ?? ""),
    }))
    .filter(({ start }) => Number.isFinite(start) && start > now)
    .sort((a, b) => a.start - b.start)
    .at(0)?.presale;
}

function normalizeEvent(
  event: TicketmasterEvent,
  now: number,
  seen: Set<string>,
): Presale | undefined {
  const { dates, id, images, name, sales, url, _embedded } = event;
  if (CANCELED_EVENT_CODES.has(dates?.status?.code ?? "")) return undefined;

  const venue = _embedded?.venues?.at(0);
  const attraction = _embedded?.attractions?.at(0);
  const artistName = attraction?.name ?? name;
  const eventUrl = ticketUrl(url);
  const next = findNextPresale(sales?.presales, now);

  if (!artistName || !venue?.name || !venue.city?.name || !eventUrl) {
    return undefined;
  }
  if (!next?.startDateTime) return undefined;

  const eventId = id ?? eventUrl;
  if (seen.has(eventId)) return undefined;
  seen.add(eventId);

  return {
    eventId: id,
    artistId: attraction?.id,
    artistName,
    artistImageUrl:
      artistImage(attraction?.images ?? []) ?? artistImage(images ?? []),
    artistUrl: ticketUrl(attraction?.url) ?? eventUrl,
    presaleUrl: ticketUrl(next.url) ?? eventUrl,
    venueName: venue.name,
    city: venue.city.name,
    startsAt: next.startDateTime,
    timeZone: venue.timezone ?? dates?.timezone ?? DEFAULT_TIME_ZONE,
    presaleName: next.name ?? DEFAULT_PRESALE_NAME,
  };
}

export function normalizeTicketmasterPresales(
  events: readonly TicketmasterEvent[],
  now: number,
): Presale[] {
  const seen = new Set<string>();
  const presales = events.flatMap((event) => {
    const presale = normalizeEvent(event, now, seen);
    return presale ? [presale] : [];
  });

  return presales.sort(
    (a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt),
  );
}
