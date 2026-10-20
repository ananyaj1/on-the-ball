import { DM_Mono, Fraunces } from "next/font/google";

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-fraunces",
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-dm-mono",
});
