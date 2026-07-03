import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSEOMetadata } from "@/lib/seo";
import { db } from "@/lib/db";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = getSEOMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let categories: any[] = [];
  try {
    categories = await db.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.error("RootLayout: Error fetching categories", e);
  }

  return (
    <html lang="tr" className={`${inter.variable} h-full`}>
      <head>
        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1C0HCBCVRZ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1C0HCBCVRZ');
          `}
        </Script>
        {/* Google AdSense script loaded asynchronously */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-800 font-sans">
        <Header categories={categories} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
