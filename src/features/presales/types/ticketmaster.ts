export type TicketmasterImage = Readonly<{
  url?: string;
  width?: number;
  height?: number;
  fallback?: boolean;
}>;

export type TicketmasterEvent = Readonly<{
  id?: string;
  name?: string;
  url?: string;
  images?: readonly TicketmasterImage[];
  dates?: {
    timezone?: string;
    status?: { code?: string };
  };
  sales?: {
    presales?: readonly {
      name?: string;
      url?: string;
      startDateTime?: string;
    }[];
  };
  _embedded?: {
    venues?: readonly {
      name?: string;
      timezone?: string;
      city?: { name?: string };
    }[];
    attractions?: readonly {
      id?: string;
      name?: string;
      url?: string;
      images?: readonly TicketmasterImage[];
    }[];
  };
}>;

export type TicketmasterEventsResponse = Readonly<{
  _embedded?: { events?: readonly TicketmasterEvent[] };
  page?: { totalPages?: number };
}>;
