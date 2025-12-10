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
  const awaitedParams = await params;
  const { locale } = awaitedParams;

  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;
  const messages = messagesMap[safeLocale];

  // Get SEO data from indexPage.bbwChat.seo (messages/en.json)
  const localization = messages as any;
  const categorySeoData = localization.indexPage?.bbwChat?.seo || {};
  const seoData = localization.indexPage?.seo || {};
  const openGraphData = categorySeoData.openGraph || seoData.openGraph || {};

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  
  // Generate languages object for alternates from available locales with full URLs
  const cleanSiteUrl = SITE_URL.replace(/\/e-01\/?$/, "").replace(/\/e-01\//, "/").replace(/\/$/, "");
  const languages: Record<string, string> = {};
  Object.keys(messagesMap).forEach((loc) => {
    const path = `/${loc}/bbwchat`;
    languages[loc] = cleanSiteUrl ? `${cleanSiteUrl}${path}` : path;
  });

  // Generate canonical URL
  const canonical = locale === "en" ? "/bbwchat" : `/${locale}/bbwchat`;
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale and category
  const baseUrl = SITE_URL.replace(/\/$/, "");
  let pageUrl = `${baseUrl}/bbwchat`;
  if (pathname && pathname !== "/") {
    pageUrl = `${baseUrl}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${baseUrl}/bbwchat` : `${baseUrl}/${locale}/bbwchat`;
  }

  // Process metadataBase from JSON
  const metadataBaseUrl = categorySeoData.metadataBase && categorySeoData.metadataBase !== ""
    ? (categorySeoData.metadataBase.startsWith("http") ? categorySeoData.metadataBase : `${SITE_URL}${categorySeoData.metadataBase}`)
    : (seoData.metadataBase && seoData.metadataBase !== ""
      ? (seoData.metadataBase.startsWith("http") ? seoData.metadataBase : `${SITE_URL}${seoData.metadataBase}`)
      : SITE_URL);

  // Replace {year} with current year in title
  const currentYear = new Date().getFullYear();
  const finalTitle = (categorySeoData.title || seoData.title || "BBW Chat").replace("{year}", currentYear.toString());
  const finalOpenGraphTitle = (openGraphData.title || categorySeoData.title || seoData.title || "BBW Chat").replace("{year}", currentYear.toString());

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("bbw", IMAGE_URL);

  return {
    metadataBase: new URL(metadataBaseUrl),
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
      <HeroBanner pageKey="bbwChat" />
      <CamGrid category="bbw" siteKey="bbwChat"/>  
      <SitesSlider  category="bbw"/>
      <CategoryContent category="bbw" siteKey="bbwChat" />
      <Shortcuts />
    </>
  );
}
