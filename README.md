# on the ball

A concert presale tracker built with Next.js and Ticketmaster's Discovery API.

**Live site:** [on-the-ball-phi.vercel.app](https://on-the-ball-phi.vercel.app/)

## Features

- Discover upcoming music presales in the configured Ticketmaster region.
- Follow artists and view their presales in the Following feed.
- See presale dates, times, countdowns, venue details, and ticket links.
- Keep API access server-side and show clear disconnected, unavailable, and empty states.

## Local setup

Requires Node.js 24 or later.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Add a Ticketmaster Discovery API key to `.env.local`:

```env
TICKETMASTER_API_KEY=your_key_here
```

`TICKETMASTER_DMA_ID` is optional and defaults to `345` (New York metro area). Keep the API key server-only; do not use a `NEXT_PUBLIC_` prefix.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
```

The app only displays presales published by Ticketmaster. It does not obtain presale passwords, reserve tickets, or purchase tickets.

API reference: [Ticketmaster Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/).
