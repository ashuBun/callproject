import SearchList from "./searchList";
import type { Metadata } from "next";
import { headers } from "next/headers";
import messagesMap from "@/messages"; 
import type { AppLocale } from "@/messages";
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";

// Helper function to capitalize text
function capitalizeText(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = q?.trim() || "";

  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;
  const messages = messagesMap[safeLocale];

  // Get SEO data from indexPage.seo (messages/en.json) with fallback
  const localization = messages as any;
  const seoData = {
    Title: "Search - Find the Best Adult Chat Sites",
    Description: "Search and discover the top adult chat sites, cam sites, and live sex chat platforms.",
    Keywords: "search adult chat, find cam sites, adult sites search"
  };

  // If query length is greater than 0, replace "Online" with search query in meta tags
  const hasQuery = query.length > 0;
  
  // Capitalize query if it exists
  const capitalizedQuery = hasQuery ? capitalizeText(query) : "";
  
  const title = hasQuery 
    ? `${capitalizedQuery} Online Chatroom | ${capitalizedQuery} Video Chat With Online Girls, Live Cam Chat!`
    : seoData.Title;

  const description = hasQuery
    ? `Welcome to ${capitalizedQuery} Camchat, Random Video Chat With Real ${capitalizedQuery} Girls. Start Datings & Flirting With ${capitalizedQuery} Beauties Over Webcam ${capitalizedQuery}.`
    : seoData.Description;

  const keywords = hasQuery
    ? `${capitalizedQuery}, ${seoData.Keywords}`
    : seoData.Keywords;

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale
  let pageUrl = `${SITE_URL}/search`;
  if (pathname && pathname !== "/") {
    pageUrl = `${SITE_URL}${pathname}${hasQuery ? `?q=${encodeURIComponent(query)}` : ""}`;
  } else {
    pageUrl = locale === "en" ? `${SITE_URL}/search${hasQuery ? `?q=${encodeURIComponent(query)}` : ""}` : `${SITE_URL}/${locale}/search${hasQuery ? `?q=${encodeURIComponent(query)}` : ""}`;
  }

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("top10chat", IMAGE_URL);

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      type: "website",
      locale: safeLocale,
      url: pageUrl,
      siteName: "Top Chats",
      title: title,
      description: description,
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SearchPage() {
  return (
    <>
      <SearchList />
    </>
  );
}
