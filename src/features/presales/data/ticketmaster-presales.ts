import "server-only";

import { setTimeout as delay } from "node:timers/promises";

import { cacheLife, io } from "next/cache";

import { PRESALE_FEED_STATUS } from "../constants/presale-feed";
import type { PresaleFeed } from "../types/presale-feed";
import type {
  TicketmasterEvent,
  TicketmasterEventsResponse,
} from "../types/ticketmaster";
import { normalizeTicketmasterPresales } from "../utils/normalize-ticketmaster-presales";

const PAGE_SIZE = 200;
const MAX_PAGES = 5;
const LOOKAHEAD_DAYS = 30;
const DAY_MS = 86_400_000;

async function getTicketmasterEvents(
  dmaId: string,
): Promise<TicketmasterEvent[]> {
  "use cache";

  cacheLife({ stale: 60, revalidate: 900, expire: 1800 });

  const apiKey = process.env.TICKETMASTER_API_KEY?.trim();
  if (!apiKey) throw new Error("Ticketmaster is not configured.");

  const now = new Date();
  const until = new Date(now.getTime() + LOOKAHEAD_DAYS * DAY_MS);
  const toTimestamp = (date: Date) =>
    date.toISOString().replace(/\.\d{3}Z$/, "Z");
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.search = new URLSearchParams({
    apikey: apiKey,
    source: "ticketmaster",
    classificationName: "music",
    countryCode: "US",
    dmaId,
    startDateTime: toTimestamp(now),
    preSaleDateTime: `${toTimestamp(now)},${toTimestamp(until)}`,
    sort: "date,asc",
    size: String(PAGE_SIZE),
    locale: "en-us",
  }).toString();

  const events: TicketmasterEvent[] = [];
  let pages = 1;

  for (let page = 0; page < pages; page += 1) {
    // Public API accounts allow two requests per second.
    if (page > 0) await delay(550);
    url.searchParams.set("page", String(page));
    let response: Response;

    try {
      response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    } catch {
      // Avoid surfacing upstream URLs, which contain the API key.
      throw new Error("Ticketmaster could not be reached.");
    }

    if (!response.ok) {
      throw new Error(`Ticketmaster request failed (${response.status}).`);
    }

    const data = (await response.json()) as TicketmasterEventsResponse;
    const pageEvents = data._embedded?.events ?? [];
    if (!Array.isArray(pageEvents))
      throw new Error("Invalid Ticketmaster response.");
    events.push(...pageEvents);

    const totalPages = data.page?.totalPages ?? 1;
    if (!Number.isInteger(totalPages) || totalPages < 0) {
      throw new Error("Invalid Ticketmaster pagination.");
    }
    pages = Math.min(totalPages, MAX_PAGES);
  }

  return events;
}

export async function getTicketmasterPresales(): Promise<PresaleFeed> {
  await io();

  if (!process.env.TICKETMASTER_API_KEY?.trim()) {
    return { status: PRESALE_FEED_STATUS.notConfigured, presales: [] };
  }

  try {
    const dmaId = process.env.TICKETMASTER_DMA_ID?.trim() || "345";
    const events = await getTicketmasterEvents(dmaId);
    const now = Date.now();
    const until = now + LOOKAHEAD_DAYS * DAY_MS;
    const presales = normalizeTicketmasterPresales(events, now).filter(
      ({ startsAt }) => Date.parse(startsAt) <= until,
    );
    return { status: PRESALE_FEED_STATUS.ready, presales };
  } catch {
    return { status: PRESALE_FEED_STATUS.unavailable, presales: [] };
  }
}
