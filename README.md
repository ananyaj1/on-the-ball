# on the ball

A minimal concert presale feed built with Next.js. Discover reads published presale schedules from Ticketmaster's Discovery API for NYC-area music events. Follow an artist in Discover to see their presales in Following.

## Local setup

Use Node.js 24 or later.

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add your Ticketmaster Discovery API Consumer Key as `TICKETMASTER_API_KEY`. Get a key through the [Ticketmaster developer portal](https://developer.ticketmaster.com/). Keep it server-only; do not add a `NEXT_PUBLIC_` prefix.
4. Run `npm run dev` and open the local URL printed by Next.js.

`TICKETMASTER_DMA_ID` defaults to `345`, Ticketmaster's New York metro area. Both feeds use this regional scope.

Both tabs use the shared `PresaleFeed` renderer, `UpcomingPresales` list, follow controls, and row/photo/calendar styles. Discover is list-only and includes every matching presale. Following keeps the featured eight-ball view and uses the same list for the remaining followed-artist presales.

## Artist following

- Follow or unfollow artists with the control under their event details. Ticket links remain on the artist name and are separate from follow controls.
- Matching uses Ticketmaster attraction IDs, so following an artist includes all of their shows in the regional feed. If an ID is missing, a hash of the normalized artist name provides a fallback.
- Follows are saved in an HTTP-only, same-site browser cookie for one year. They survive reloads and navigation in that browser, but do not sync across devices or import Ticketmaster account favorites.
- Follow and unfollow actions refresh both tabs. Following never falls back to the full regional feed when the follow list is empty.
- Presale fetching and the Ticketmaster API key remain server-side. Only the follow button is a Client Component.

## Live feed behavior

- Queries US music events from Ticketmaster with published presale windows intersecting the next 30 days.
- Reads up to five pages of 200 events, respecting Discovery API's 1,000-result pagination limit. Results beyond that limit are not included.
- Spaces paginated requests to stay within the default Public APIs rate limit of two requests per second.
- Caches upstream event data for 15 minutes, then refreshes on demand. The countdown updates locally every second without making API calls.
- Chooses the earliest future presale for each event and sorts the feed by presale opening time. Dates that have already passed are excluded on each request, including when the upstream response is cached.
- Uses Ticketmaster's artist/event images and ticket links. Artist images are rendered square and in black and white.
- Shows an explicit disconnected, unavailable, or empty state rather than substituting mock events. The old sample data remains available as a development fixture and is not used by either feed.

Only presales published by Ticketmaster can appear. The Discovery API supplies schedules and links; this app does not obtain presale passwords, reserve tickets, or purchase tickets.

## Checks

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

The normalization tests use fixtures and do not require a key or network connection. A real key is needed to verify the complete live API connection.

API reference: [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/).
