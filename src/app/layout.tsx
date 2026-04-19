import type { Metadata, Viewport } from "next";
import { Work_Sans, IBM_Plex_Mono, Libre_Baskerville } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "rendion – Immobilien klar berechnet.",
  description: "Kostenlose Immobilienanalyse: Rendite, Cashflow und Langfrist-Prognosen – ohne Anmeldung.",
  openGraph: {
    title: "rendion – Immobilien klar berechnet.",
    description: "Rendite, Cashflow & Langfrist-Prognosen berechnen – kostenlos und ohne Anmeldung.",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rendion – Immobilien klar berechnet.",
    description: "Rendite, Cashflow & Langfrist-Prognosen berechnen – kostenlos und ohne Anmeldung.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("rnd_theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}else if(window.matchMedia("(prefers-color-scheme:dark)").matches){document.documentElement.setAttribute("data-theme","dark")}else{document.documentElement.setAttribute("data-theme","light")}}catch(e){}})()`,
          }}
        />
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_UMAMI_SRC ?? "https://cloud.umami.is/script.js"}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${workSans.variable} ${ibmPlexMono.variable} ${libreBaskerville.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
