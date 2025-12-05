import LoginCard from '@/components/LoginCard'
import React from 'react'
import type { Metadata } from "next";
import { headers } from "next/headers";
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
  let pageUrl = `${SITE_URL}/login`;
  if (pathname && pathname !== "/") {
    pageUrl = `${SITE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${SITE_URL}/login` : `${SITE_URL}/${locale}/login`;
  }

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("top10chat", IMAGE_URL);

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title: "Login - Top Chats",
    description: "Login to access premium features and connect with live cam models.",
    openGraph: {
      type: "website",
      locale: locale,
      url: pageUrl,
      siteName: "Top Chats",
      title: "Login - Top Chats",
      description: "Login to access premium features and connect with live cam models.",
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Login - Top Chats",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Login - Top Chats",
      description: "Login to access premium features and connect with live cam models.",
      images: [ogImageUrl],
    },
  };
}

export default function page() {
  return (
    <>
    <LoginCard/>
    </>
  )
}
