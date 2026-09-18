import type { Metadata } from "next";
import { Anton, Chivo } from "next/font/google";

import "@once-ui-system/core/css/styles.css";
import "@once-ui-system/core/css/tokens.css";
import "./globals.css";

import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = Chivo({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Avonera48 — rumah fans JKT48",
    template: "%s · Avonera48",
  },
  description:
    "Pantau siapa yang lagi live, jadwal theater, berita, dan profil member JKT48 dalam satu tempat.",
  openGraph: {
    title: "Avonera48",
    description: "Live, theater, berita, dan member JKT48 dalam satu tempat.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-theme="dark"
      data-neutral="slate"
      data-brand="red"
      data-accent="yellow"
      className={`${display.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
