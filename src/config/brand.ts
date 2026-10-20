type Brand = Readonly<{
  name: string;
  description: string;
}>;

export const BRAND = {
  name: "on the ball",
  description:
    "Follow your favorite artists, track upcoming concert presales, and get reminders before tickets go on sale.",
} as const satisfies Brand;
