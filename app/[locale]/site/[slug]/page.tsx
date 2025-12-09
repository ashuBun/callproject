import SinglePage from "@/components/SinglePage";
import type { Metadata } from "next";
import { headers } from "next/headers";
import messagesMap from "@/messages";
import type { AppLocale } from "@/messages";
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Helper function to capitalize text
function capitalizeText(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;

  // Get messages from language file (messages/en.json)
  const messages = messagesMap[safeLocale];
  
  // Get slug-specific content from singlePageBySlug.[slug] (messages/en.json lines 632-2583)
  // Example: singlePageBySlug.rabbitscams, singlePageBySlug.crazylivecams, etc.
  const singlePageBySlug = (messages as any)?.singlePageBySlug || {};
  const slugMessages = singlePageBySlug[slug] || {};
  
  // Extract metadata from singlePageBySlug.[slug].metadata
  // This connects to messages/en.json singlePageBySlug.[slug].metadata.title and description
  // Example: singlePageBySlug.rabbitscams.metadata.title (line 666)
  //          singlePageBySlug.rabbitscams.metadata.description (line 667)
  const slugMetadata = slugMessages?.metadata || {};
  
  // Priority order for title:
  // 1. singlePageBySlug.[slug].metadata.title (from messages/en.json, e.g., line 666) - highest priority
  // 2. slug as fallback
  const finalTitle = (slugMetadata?.title && slugMetadata.title.trim()) ? slugMetadata.title : slug;

  // Priority order for description:
  // 1. singlePageBySlug.[slug].metadata.description (from messages/en.json, e.g., line 667) - highest priority
  // 2. singlePageBySlug.[slug].excerpt
  // 3. singlePageBySlug.[slug].overview
  // 4. Default fallback
  const finalDescription = slugMetadata?.description ||
    slugMessages?.excerpt || 
    slugMessages?.overview || 
    `Discover ${finalTitle} - Premium adult cam site with live performers and interactive chat.`;
  
  // Get category from singlePageBySlug.[slug].metadata.category
  const finalCategory = slugMetadata?.category || "adult";

  // Capitalize the title
  const capitalizedTitle = capitalizeText(finalTitle);
  const currentYear = new Date().getFullYear();
  const titleWithSuffix = `${capitalizedTitle} - #1 Video Chat with Girls | Official Site | ${currentYear}`;

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale and slug
  const baseUrl = SITE_URL.replace(/\/$/, "");
  let pageUrl = `${baseUrl}/site/${slug}`;
  if (pathname && pathname !== "/") {
    pageUrl = `${baseUrl}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${baseUrl}/site/${slug}` : `${baseUrl}/${locale}/site/${slug}`;
  }

  // Generate languages object for alternates from available locales with full URLs
  const cleanSiteUrl = SITE_URL.replace(/\/e-01\/?$/, "").replace(/\/e-01\//, "/").replace(/\/$/, "");
  const languages: Record<string, string> = {};
  Object.keys(messagesMap).forEach((loc) => {
    const path = `/${loc}/site/${slug}`;
    languages[loc] = cleanSiteUrl ? `${cleanSiteUrl}${path}` : path;
  });

  // Generate canonical URL
  const canonical = locale === "en" ? `/site/${slug}` : `/${locale}/site/${slug}`;

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("top10chat", IMAGE_URL);

  return {
    metadataBase: new URL(SITE_URL),
    title: titleWithSuffix,
    description: finalDescription,
    keywords: `${capitalizedTitle}, ${finalTitle}, adult cam, live chat, cam site, ${finalCategory}`,
    openGraph: {
      type: "website",
      locale: safeLocale,
      url: pageUrl,
      siteName: "Top Chats",
      title: titleWithSuffix,
      description: finalDescription,
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: titleWithSuffix,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: titleWithSuffix,
      description: finalDescription,
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

export default async function SingleSlugPage({ params }: Props) {
  const { slug } = await params;
  return <SinglePage pageKey={slug} title={slug} />;
}


