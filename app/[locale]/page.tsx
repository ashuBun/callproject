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
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";


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

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  
  // Generate languages object for alternates from available locales with full URLs
  const cleanSiteUrl = SITE_URL.replace(/\/e-01\/?$/, "").replace(/\/e-01\//, "/");
  const languages: Record<string, string> = {};
  Object.keys(messagesMap).forEach((loc) => {
    const path = `/${loc}`;
    languages[loc] = cleanSiteUrl ? `${cleanSiteUrl}${path}` : path;
  });

  // Generate canonical URL
  const canonical = locale === "en" ? "/" : `/${locale}`;
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale
  let pageUrl = SITE_URL;
  if (pathname && pathname !== "/") {
    pageUrl = `${SITE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`;
  }

  // Process image URL from JSON - use IMAGE_URL if it's a relative path, otherwise use as-is
  // If no image in JSON, use top-ranked site's hero image
  let ogImageUrl = openGraphData.image || getTopSiteImageUrl("top10chat", IMAGE_URL);
  if (ogImageUrl && ogImageUrl.startsWith("/")) {
    ogImageUrl = `${IMAGE_URL}${ogImageUrl}`;
  } else if (ogImageUrl && !ogImageUrl.startsWith("http")) {
    ogImageUrl = `${IMAGE_URL}/${ogImageUrl}`;
  }

  // Process metadataBase from JSON
  const metadataBaseUrl = seoData.metadataBase && seoData.metadataBase !== "" 
    ? (seoData.metadataBase.startsWith("http") ? seoData.metadataBase : `${SITE_URL}${seoData.metadataBase}`)
    : SITE_URL;

  // Replace {year} with current year in title
  const currentYear = new Date().getFullYear();
  const finalTitle = (seoData.title || "Top 10 Chat Sites").replace("{year}", currentYear.toString());
  const finalOpenGraphTitle = (openGraphData.title || seoData.title || "Top 10 Chat Sites").replace("{year}", currentYear.toString());

  return {
    metadataBase: new URL(metadataBaseUrl),
    title: finalTitle,
    description: seoData.description || "",
    openGraph: {
      type: openGraphData.type || "website",
      title: finalOpenGraphTitle,
      description: openGraphData.description || seoData.description || "",
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
      description: openGraphData.description || seoData.description || "",
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
