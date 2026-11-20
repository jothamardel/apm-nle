import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/AppProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "NLE Makinde/Daura APM Grassroots Support Network | Reimagine. Reset. Rebuild",
    template: "%s | NLE Grassroots APM",
  },
  description:
    "Official community organization website for NLE Makinde/Daura APM Grassroots Support Network (www.nlegrassroots.org). Join online, explore real-time State to Polling Unit analytics, volunteer for Protect The Ballots or Social Media Team, and fund grassroots outreaches.",
  metadataBase: new URL("https://www.nlegrassroots.org"),
  openGraph: {
    title: "NLE Makinde/Daura APM Grassroots Support Network",
    description:
      "Reimagine. Reset. Rebuild — Mobilizing Nigerians across all 36 states, FCT, 774 LGAs & 176,846 Polling Units for the Makinde/Daura APM Ticket.",
    siteName: "NLE Grassroots Support Network",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-[#E6B42C]/35 selection:text-[#0B3D2E]">
        <AppProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#0B3D2E] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}

