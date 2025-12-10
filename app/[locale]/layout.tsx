import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaMaskErrorBoundary from "@/components/MetaMaskErrorBoundary";
import Script from "next/script";
import messagesMap from "@/messages";
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";

const SERVER_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_SERVER_URL || "https://next.x-u.cc";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
const IMAGE_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  const metadata = messages.metadata;

  // Get current pathname from headers (set by middleware)
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Construct the current page URL based on pathname
  // Note: Individual pages will override this URL with their specific URLs
  const baseUrl = SITE_URL.replace(/\/$/, "");
  let currentUrl = baseUrl;
  if (pathname && pathname !== "/") {
    // Pathname already includes locale (e.g., /en/bbwchat or /fr/bbwchat)
    // Just prepend SITE_URL
    currentUrl = `${baseUrl}${pathname}`;
  } else {
    // Fallback: construct URL based on locale only
    currentUrl = locale === "en" ? baseUrl : `${baseUrl}/${locale}`;
  }

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("top10chat", IMAGE_URL);

  return {
    metadataBase: new URL(SITE_URL),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords || "chat, rooms, online, cam girls",
    icons: {
      icon: [
        {
          url: `${SERVER_URL}/images/ficon.jpg`,
          type: "image/jpeg",
        },
      ],
      shortcut: `${SERVER_URL}/images/ficon.jpg`,
      apple: `${SERVER_URL}/images/ficon.jpg`,
    },
    // Layout provides default Open Graph, but individual pages will override with their specific URLs
    openGraph: {
      type: "website",
      locale: locale,
      url: currentUrl, // This will be overridden by page-specific URLs
      siteName: "Top Chats",
      title: metadata.title, // This will be overridden by page-specific titles
      description: metadata.description, // This will be overridden by page-specific descriptions
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
    },
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: (() => {
        const cleanSiteUrl = SITE_URL.replace(/\/e-01\/?$/, "").replace(/\/e-01\//, "/").replace(/\/$/, "");
        const langs: Record<string, string> = {};
        Object.keys(messagesMap).forEach((loc) => {
          const path = `/${loc}`;
          langs[loc] = cleanSiteUrl ? `${cleanSiteUrl}${path}` : path;
        });
        return langs;
      })(),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head />
      <body>
        {/* ✅ Use Next.js Script instead of raw <script> */}
        <Script
          src="/metamask-error-handler.js"
          strategy="afterInteractive"
        />
        <MetaMaskErrorBoundary>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Header />
            {children}
            <Footer />
          </NextIntlClientProvider>
        </MetaMaskErrorBoundary>
      </body>
    </html>
  );
}
