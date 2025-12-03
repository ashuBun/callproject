import Image from "next/image";
import Shortcuts from "@/components/Shortcuts";
import SitesSlider from "@/components/SitesSlider";
import HeroBanner from "@/components/banners/HeroBanner";
import CamGrid from "@/components/CamGrid";

import type { Metadata } from "next";
import { headers } from "next/headers";
import messagesMap from "@/messages";
import type { AppLocale } from "@/messages";
import CategoryContent from "@/components/CategoryContent";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;
  const messages = messagesMap[safeLocale];

  // Get SEO data from indexPage.seo (messages/en.json)
  const localization = messages as any;
  const seoData = localization.indexPage?.seo || {};
  const openGraphData = seoData.openGraph || {};

  // Generate languages object for alternates from available locales
  const languages: Record<string, string> = {};
  Object.keys(messagesMap).forEach((loc) => {
    languages[loc] = loc === "en" ? "/" : `/${loc}`;
  });

  // Generate canonical URL
  const canonical = locale === "en" ? "/" : `/${locale}`;
  
  // Generate full page URL dynamically
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://x-chats.com";
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale
  let pageUrl = BASE_URL;
  if (pathname && pathname !== "/") {
    pageUrl = `${BASE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`;
  }

  // Replace {year} with current year in title
  const currentYear = new Date().getFullYear();
  const finalTitle = (seoData.title || "Top 10 Chat Sites").replace("{year}", currentYear.toString());
  const finalOpenGraphTitle = (openGraphData.title || seoData.title || "Top 10 Chat Sites").replace("{year}", currentYear.toString());

  return {
    metadataBase: seoData.metadataBase ? new URL(seoData.metadataBase) : new URL(BASE_URL),
    title: finalTitle,
    description: seoData.description || "",
    openGraph: {
      type: openGraphData.type || "website",
      title: finalOpenGraphTitle,
      description: openGraphData.description || seoData.description || "",
      images: openGraphData.image ? [openGraphData.image] : [{
        url: `${BASE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: finalOpenGraphTitle,
      }],
      url: pageUrl,
      siteName: openGraphData.siteName || "Top Chats",
      locale: safeLocale,
    },
    twitter: {
      card: "summary_large_image",
      title: finalOpenGraphTitle,
      description: openGraphData.description || seoData.description || "",
      images: openGraphData.image ? [openGraphData.image] : [`${BASE_URL}/images/og-image.jpg`],
    },
    alternates: {
      canonical: canonical,
      languages: languages,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}



export default async function Home() {
  return (
    <>
      <HeroBanner pageKey="top10chat" />
      <CamGrid category="top10chat" siteKey="topChats" />
      <SitesSlider category="top10chat" />
      <CategoryContent category="top10chat" siteKey="topChats" />
      <Shortcuts />
    </>
  );
}
