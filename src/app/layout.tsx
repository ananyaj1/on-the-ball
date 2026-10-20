import type { Metadata } from "next";
import { BRAND } from "@/config/brand";
import { dmMono, fraunces } from "@/config/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className={`${dmMono.className} flex min-h-full flex-col`}>
        {children}
      </body>
    </html>
  );
}
