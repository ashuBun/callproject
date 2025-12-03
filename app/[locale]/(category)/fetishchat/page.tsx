import React from "react";
import Shortcuts from "@/components/Shortcuts";
import SitesSlider from "@/components/SitesSlider";
import HeroBanner from "@/components/banners/HeroBanner";

import type { Metadata } from "next";
import { headers } from "next/headers";
import messagesMap from "@/messages"; 
import type { AppLocale } from "@/messages"; 
import CamGrid from "@/components/CamGrid";
import CategoryContent from "@/components/CategoryContent";
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;
  const messages = messagesMap[safeLocale];

  // Get SEO data from indexPage.fetishChat.seo (messages/en.json)
  const localization = messages as any;
  const categorySeoData = localization.indexPage?.fetishChat?.seo || {};
  const seoData = localization.indexPage?.seo || {};
  const openGraphData = categorySeoData.openGraph || seoData.openGraph || {};

  // Generate languages object for alternates from available locales
  const languages: Record<string, string> = {};
  Object.keys(messagesMap).forEach((loc) => {
    languages[loc] = loc === "en" ? "/fetishchat" : `/${loc}/fetishchat`;
  });

  // Generate canonical URL
  const canonical = locale === "en" ? "/fetishchat" : `/${locale}/fetishchat`;
  
  // Generate full page URL dynamically
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://x-chats.com";
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale and category
  let pageUrl = `${BASE_URL}/fetishchat`;
  if (pathname && pathname !== "/") {
    pageUrl = `${BASE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${BASE_URL}/fetishchat` : `${BASE_URL}/${locale}/fetishchat`;
  }

  // Replace {year} with current year in title
  const currentYear = new Date().getFullYear();
  const finalTitle = (categorySeoData.title || seoData.title || "Fetish Chat").replace("{year}", currentYear.toString());
  const finalOpenGraphTitle = (openGraphData.title || categorySeoData.title || seoData.title || "Fetish Chat").replace("{year}", currentYear.toString());

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("fetish", BASE_URL);

  return {
    metadataBase: categorySeoData.metadataBase ? new URL(categorySeoData.metadataBase) : (seoData.metadataBase ? new URL(seoData.metadataBase) : new URL(BASE_URL)),
    title: finalTitle,
    description: categorySeoData.description || seoData.description || "",
    openGraph: {
      type: openGraphData.type || "website",
      title: finalOpenGraphTitle,
      description: openGraphData.description || categorySeoData.description || seoData.description || "",
      images: [{
        url: ogImageUrl,
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
      description: openGraphData.description || categorySeoData.description || seoData.description || "",
      images: [ogImageUrl],
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

export default function Page() {
  return (
    <>
      <HeroBanner pageKey="fetishChat" />
      <CamGrid category="fetish" siteKey="fetish"/>  
      <SitesSlider category="fetish"/>
      <CategoryContent category="fetish" siteKey="fetish" />
      <Shortcuts />
    </>
  );
}
