import React from 'react'
import type { Metadata } from "next";
import { headers } from "next/headers";
import FullSite from '@/components/FullSite'
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale
  let pageUrl = `${SITE_URL}/site`;
  if (pathname && pathname !== "/") {
    pageUrl = `${SITE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${SITE_URL}/site` : `${SITE_URL}/${locale}/site`;
  }

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("top10chat", IMAGE_URL);

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title: "Sites",
    description: "Browse all top-rated live chat and cam sites reviewed for your best online experience.",
    keywords: "Chat Sites, Cam Sites, Top Chat Platforms",
    openGraph: {
      type: "website",
      locale: locale,
      url: pageUrl,
      siteName: "Top Chats",
      title: "Sites",
      description: "Browse all top-rated live chat and cam sites reviewed for your best online experience.",
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Sites",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sites",
      description: "Browse all top-rated live chat and cam sites reviewed for your best online experience.",
      images: [ogImageUrl],
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
    <FullSite/>
    </>
  )
}
