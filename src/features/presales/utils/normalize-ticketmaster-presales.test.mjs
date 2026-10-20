import assert from "node:assert/strict";
import test from "node:test";

import { normalizeTicketmasterPresales } from "./normalize-ticketmaster-presales.ts";

const now = Date.parse("2026-10-19T16:00:00Z");
const start = "2026-10-22T14:00:00Z";

function event(overrides = {}) {
  return {
    id: "event-1",
    name: "Artist — NYC Tour",
    url: "https://www.ticketmaster.com/event/event-1",
    dates: { status: { code: "onsale" }, timezone: "America/New_York" },
    sales: { presales: [{ name: "Artist presale", startDateTime: start }] },
    _embedded: {
      venues: [
        {
          name: "NYC Venue",
          city: { name: "Brooklyn" },
          timezone: "America/New_York",
        },
      ],
      attractions: [
        {
          id: "K8artist1",
          name: "Artist",
          url: "https://www.ticketmaster.com/artist/1",
        },
      ],
    },
    ...overrides,
  };
}

test("uses the published presale opening rather than an event date, with real venue and ticket URLs", () => {
  const [presale] = normalizeTicketmasterPresales([event()], now);
  assert.equal(presale.startsAt, start);
  assert.equal(presale.artistName, "Artist");
  assert.equal(presale.artistId, "K8artist1");
  assert.equal(presale.venueName, "NYC Venue");
  assert.equal(presale.city, "Brooklyn");
  assert.equal(presale.timeZone, "America/New_York");
  assert.equal(
    presale.presaleUrl,
    "https://www.ticketmaster.com/event/event-1",
  );
});

test("chooses the earliest future sale, excludes elapsed and invalid dates, and deduplicates events", () => {
  const input = event({
    sales: {
      presales: [
        { startDateTime: "2026-10-23T14:00:00Z" },
        { startDateTime: "2026-10-18T14:00:00Z" },
        { startDateTime: "not-a-date" },
        { startDateTime: new Date(now).toISOString() },
        { startDateTime: start },
      ],
    },
  });
  const result = normalizeTicketmasterPresales([input, input], now);
  assert.equal(result.length, 1);
  assert.equal(result[0].startsAt, start);
  assert.deepEqual(
    normalizeTicketmasterPresales([input], Date.parse("2026-10-24T00:00:00Z")),
    [],
  );
});

test("sorts by presale time across different events", () => {
  const sooner = event({
    id: "event-2",
    sales: { presales: [{ startDateTime: "2026-10-21T14:00:00Z" }] },
  });
  assert.deepEqual(
    normalizeTicketmasterPresales([event(), sooner], now).map(
      (presale) => presale.startsAt,
    ),
    ["2026-10-21T14:00:00Z", start],
  );
});

test("retains announced future presales for events that are not on sale yet", () => {
  const result = normalizeTicketmasterPresales(
    [event({ dates: { status: { code: "offsale" } } })],
    now,
  );
  assert.equal(result.length, 1);
  assert.equal(result[0].eventId, "event-1");
});

test("excludes events without announced presales, missing venue details, or canceled sales", () => {
  for (const overrides of [
    { sales: undefined },
    { sales: { presales: [] } },
    { _embedded: undefined },
    { dates: { status: { code: "canceled" } } },
    { dates: { status: { code: "postponed" } } },
  ]) {
    assert.deepEqual(
      normalizeTicketmasterPresales([event(overrides)], now),
      [],
    );
  }
});

test("uses Ticketmaster artist imagery and rejects unrelated hosts", () => {
  const input = event();
  input._embedded.attractions[0].images = [
    { url: "https://unrelated.example/portrait.jpg", width: 128, height: 128 },
    {
      url: "https://s1.ticketm.net/dam/fallback.jpg",
      width: 128,
      height: 128,
      fallback: true,
    },
    {
      url: "https://s1.ticketm.net/dam/landscape.jpg",
      width: 640,
      height: 360,
    },
    { url: "http://s1.ticketm.net/dam/portrait.jpg", width: 150, height: 225 },
  ];
  assert.equal(
    normalizeTicketmasterPresales([input], now)[0].artistImageUrl,
    "https://s1.ticketm.net/dam/portrait.jpg",
  );
});

test("rejects unsafe event links and falls back to the event for unsupported presale links", () => {
  for (const url of [
    "javascript:alert(1)",
    "https://www.ticketmaster.com.evil.example/event/1",
    "https://evil.example/event/1",
    "https://user:password@www.ticketmaster.com/event/1",
  ]) {
    assert.deepEqual(normalizeTicketmasterPresales([event({ url })], now), []);
  }
  const input = event({
    sales: {
      presales: [
        { startDateTime: start, url: "https://unrelated.example/presale" },
      ],
    },
  });
  assert.equal(
    normalizeTicketmasterPresales([input], now)[0].presaleUrl,
    input.url,
  );
});
