"use client";
import Image from "next/image";
import Link from "next/link";
import { Check, DollarSign, Crown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale, useMessages } from "next-intl";
import camSites from "@/data/sites.json";
import HeroBanner from "@/components/banners/HeroBanner";
import messagesMap from "@/messages";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Map search terms to category keywords
const categoryMappings: Record<string, string[]> = {
  "sex chat sites": ["sexcam", "sex"],
  "mobile sex cams": ["sexcam", "mobile"],
  "adult chat": ["sexcam", "adult"],
  "chat room sites": ["chat", "room"],
  "big tits chat": ["big", "tits", "bbw"],
  "bdsm sites": ["fetish", "bdsm"],
  "roulette chat sites": ["random", "roulette"],
  "webcam chat sites": ["webcam", "chat"],
  "cam girls": ["sexcam", "cam"],
  "asian chat sites": ["asian"],
  "lesbian chat": ["lesbian"],
  "latina chat": ["latina"],
  "hairy cams": ["hairy"],
  "amateur chat": ["amateur"],
  "transsexual cams": ["transsexual", "trans"],
  "gay chat sites": ["gay"],
  "webcam job sites": ["webcam", "job"],
  "anal chat": ["anal"],
  "smoking chat sites": ["smoking"],
  "masturbation chat": ["masturbation"],
  "arab chat": ["arab"],
  "dirty talk chat": ["dirty", "talk"],
  "toy chat": ["toy"],
  "indian chat sites": ["indian"],
  "findom sites": ["findom"],
  "foot fetish sites": ["foot", "fetish"],
};

// Map Header.nav keys to category keywords
const navKeyToCategories: Record<string, string[]> = {
  "sexCams": ["sexcam", "sex"],
  "freeChat": ["freecams", "free"],
  "ebonyChat": ["ebony"],
  "bbwChat": ["bbw"],
  "milfChat": ["milfchat", "milf"],
  "teenChat": ["teen"],
  "randomChat": ["random"],
  "fetishChat": ["fetish"],
  "voyeurCam": ["voyeur"],
  "top10": ["top10chat"],
};

// Function to find category keywords from language file translations
// This checks ALL language files, not just the current locale
function getCategoryKeywordsFromTranslations(query: string): string[] {
  const normalizedQuery = query.toLowerCase();
  const keywords: string[] = [];

  // Check ALL language files
  Object.values(messagesMap).forEach((messages: any) => {
    // Check Header.nav translations
    if (messages?.Header?.nav) {
      const navItems = messages.Header.nav;
      for (const [key, translatedText] of Object.entries(navItems)) {
        const text = String(translatedText).toLowerCase();
        // Check if query matches the translated text
        if (
          text.includes(normalizedQuery) ||
          normalizedQuery.includes(text) ||
          text === normalizedQuery
        ) {
          const categories = navKeyToCategories[key];
          if (categories) {
            keywords.push(...categories);
          }
        }
      }
    }

    // Check Banner titles
    if (messages?.Banner) {
      const banners = messages.Banner;
      for (const [key, bannerData] of Object.entries(banners)) {
        if (bannerData && typeof bannerData === "object") {
          const title = (bannerData as any)?.title?.toLowerCase() || "";
          if (
            title.includes(normalizedQuery) ||
            normalizedQuery.includes(title) ||
            title === normalizedQuery
          ) {
            // Map banner keys to categories
            if (key === "sexCams") keywords.push("sexcam", "sex");
            else if (key === "freeChat") keywords.push("freecams", "free");
            else if (key === "ebonyChat") keywords.push("ebony");
            else if (key === "bbwChat") keywords.push("bbw");
            else if (key === "milfChat") keywords.push("milfchat", "milf");
            else if (key === "teenChat") keywords.push("teen");
            else if (key === "randomChat") keywords.push("random");
            else if (key === "fetishChat") keywords.push("fetish");
            else if (key === "voyeurCam") keywords.push("voyeur");
            else if (key === "top10chat") keywords.push("top10chat");
          }
        }
      }
    }

    // Check individual words in query against translations
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);
    queryWords.forEach((word) => {
      if (messages?.Header?.nav) {
        const navItems = messages.Header.nav;
        for (const [key, translatedText] of Object.entries(navItems)) {
          const text = String(translatedText).toLowerCase();
          if (text.includes(word) || word.includes(text)) {
            const categories = navKeyToCategories[key];
            if (categories) {
              keywords.push(...categories);
            }
          }
        }
      }
    });
  });

  return [...new Set(keywords)]; // Remove duplicates
}

// Helper function to capitalize text
function capitalizeText(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function SearchList() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("SearchPage");
  const tr = useTranslations();
  const messages = useMessages();
  const query = (searchParams.get("q") || "").trim();
  const normalized = query.toLowerCase();
  const searchWords = normalized.split(/\s+/).filter(Boolean);
  
  // Capitalize query for display
  const capitalizedQuery = query ? capitalizeText(query) : "";

  // Get category keywords from English mappings
  let categoryKeywords = categoryMappings[normalized] || [];

  // Get category keywords from ALL language file translations
  // This ensures search works in any language, regardless of current locale
  const translationKeywords = getCategoryKeywordsFromTranslations(query);
  categoryKeywords = [...categoryKeywords, ...translationKeywords];

  // Remove duplicates
  categoryKeywords = [...new Set(categoryKeywords)];

  const results = normalized
    ? camSites
        .map((site) => {
          // Build haystack from English site data
          const haystack = [site.title, site.slug, ...(site.categories || [])]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          // Calculate relevance score
          let relevanceScore = 0;

          // Check if any category keyword matches OR if search words match
          const categoryMatch = categoryKeywords.some((keyword) =>
            haystack.includes(keyword)
          );
          const wordMatch = searchWords.some((word) => haystack.includes(word));

          // Title exact match = highest score
          if (site.title.toLowerCase() === normalized) {
            relevanceScore += 100;
          }
          // Title starts with query
          else if (site.title.toLowerCase().startsWith(normalized)) {
            relevanceScore += 80;
          }
          // Title contains query
          else if (site.title.toLowerCase().includes(normalized)) {
            relevanceScore += 60;
          }

          // Slug match
          if (site.slug.toLowerCase().includes(normalized)) {
            relevanceScore += 50;
          }

          // Category keyword match
          if (categoryMatch) {
            relevanceScore += 40;
          }

          // Word match in title/slug
          if (wordMatch) {
            relevanceScore += 30;
          }

          // Check if query matches translated site content from ALL languages
          let translatedMatch = false;
          
          // Check site content in ALL language files, not just current locale
          Object.values(messagesMap).forEach((langMessages: any) => {
            if (langMessages?.singlePageBySlug?.[site.slug]) {
              const siteContent = langMessages.singlePageBySlug[site.slug];
              const contentText = [
                siteContent?.toppara,
                siteContent?.secppara,
                siteContent?.overview,
                siteContent?.excerpt,
                ...(Array.isArray(siteContent?.features) ? siteContent.features : []),
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              // Check if query matches any translated content
              if (
                contentText.includes(normalized) ||
                normalized.includes(contentText) ||
                searchWords.some((word) => contentText.includes(word))
              ) {
                translatedMatch = true;
                relevanceScore += 20; // Lower score for content match
              }
            }
          });

          // Get rating and performers count (like topchatgrid.tsx)
          const rating = site.rating || 0;
          
          // Get performers count from site or translated messages
          const performersText = 
            (messages?.singlePageBySlug?.[site.slug]?.performers as string) ||
            site.performers ||
            "0";
          
          // Extract number from performers string (e.g., "8,347+ " -> 8347)
          const getPerformersCount = (performers: string): number => {
            if (!performers) return 0;
            const numStr = performers.replace(/[,+\s]/g, "");
            const num = parseInt(numStr, 10);
            return isNaN(num) ? 0 : num;
          };
          
          const performersCount = getPerformersCount(performersText);

          // Only include if matches
          if (categoryMatch || wordMatch || translatedMatch) {
            return { site, relevanceScore, rating, performersCount };
          }
          return null;
        })
        .filter((item): item is { site: typeof camSites[0]; relevanceScore: number; rating: number; performersCount: number } => item !== null)
        .sort((a, b) => {
          // First sort by relevance score (highest first)
          if (b.relevanceScore !== a.relevanceScore) {
            return b.relevanceScore - a.relevanceScore;
          }
          
          // If relevance score is same, sort by rating (like topchatgrid.tsx)
          // Rating 5 gets priority
          if (a.rating === 5 && b.rating !== 5) return -1;
          if (b.rating === 5 && a.rating !== 5) return 1;
          if (a.rating !== b.rating) {
            return b.rating - a.rating;
          }
          
          // If rating is same, sort by performers count (highest first)
          return b.performersCount - a.performersCount;
        })
        .map((item) => item.site) // Extract just the site objects
    : [];

  return (
    <>
      <section className="block bg-black/3">
        <div className="py-[40px] md:py-[60px]">
          <div className="w-full mx-auto px-[15px]">
            <div className="flex flex-col gap-[15px]">
              <h1 className="md:text-[40px] lg:text-[80px] text-black font-bold text-center capitalize">
               
               
                {query ? t("searchBanner.searchingFor", { query }) : t("searchBanner.title")}
              </h1>
              <p className="text-[20px] text-black text-center">
                {query && capitalizedQuery
                  ? `${capitalizedQuery} Online Chatroom | ${capitalizedQuery} Video Chat With Online Girls, Live Cam Chat!`
                  : t("searchBanner.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="block py-[40px] bg-[#fafafa] min-h-[80vh]">
        <div className="w-full max-w-[1030px] mx-auto px-[15px]">
          {/* <div className="mb-5">
            <h1 className="text-[22px] font-semibold text-black">
              {t("title", { count: results.length })}
            </h1>
            <p className="text-[14px] text-slate-600">
              {t("showing", { query })}
            </p>
          </div> */}

          {results.length === 0 ? (
            <div className="text-[14px] text-slate-700">
              {query ? t("noResults") : t("noQuery")}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((site, index) => {
                const slugMessages =
                  messages?.singlePageBySlug?.[site.slug] || {};

                // Merge features: prefer slugMessages.features if it's an array
                const siteFeatures = Array.isArray(slugMessages?.features)
                  ? slugMessages.features
                  : [];

                const performers =
                  (slugMessages?.performers as string) ||
                  site.performers ||
                  "10,000+ active users";

                return (
                  <div
                    key={site.id ?? index}
                    className="flex flex-wrap gap-4 items-center bg-white py-[15px] px-[20px] rounded-md grow md:grow-0 md:basis-[calc(25%-1rem)] justify-center md:justify-between shadow"
                  >
                    {/* Thumbnail with index */}
                    <div className="grow md:grow-0 md:basis-[260px]">
                      <div className="aspect-video w-full rounded-md overflow-hidden relative">
                        <h2 className="text-black aspect-square w-[40px] absolute top-1/2 left-0 transform -translate-y-1/2 z-[3] bg-yellow-500 rounded-r-full text-center leading-[35px] font-semibold text-[14px] grid place-items-center">
                          <span className="relative">
                            {index === 0 && (
                              <Crown
                                size={13}
                                className="absolute top-[-2px] left-1/2 -translate-x-1/2"
                              />
                            )}
                            <span>{index + 1}</span>
                          </span>
                        </h2>
                        <img
                          src={`${SERVER_URL}${site.hero}`}
                          alt={site.title}
                          width={500}
                          height={281}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Logo + review link */}
                    <div className="shrink-0 w-[150px] text-center">
                      <div className="h-[30px] mx-auto table">
                        <img
                          src={`${SERVER_URL}${site.logo}`}
                          width={192}
                          height={50}
                          alt={`${site.title} logo`}
                          className="h-full mx-auto"
                        />
                      </div>
                      <Link
                        href={`/${locale}/site/${site.slug}`}
                        className="text-black underline uppercase text-[12px] hover:text-[var(--primary)]"
                      >
                        {t("readReview")}
                      </Link>
                    </div>

                    {/* Feature list */}
                    <div className="grow">
                      <div className="flex flex-col mx-auto w-auto">
                        {siteFeatures
                          .slice(0, 3)
                          .map((feature: string, i: number) => (
                            <div key={i} className="flex gap-1 items-center">
                              <Check size={13} />
                              <span className="text-[12px] text-black capitalize truncate w-[180px]">
                                {feature}
                              </span>
                            </div>
                          ))}

                        {siteFeatures[3] && (
                          <div className="flex gap-1 items-center">
                            <DollarSign size={13} className="text-yellow-500" />
                            <span className="text-[12px] text-black capitalize truncate w-[180px]">
                              {siteFeatures[3]}
                            </span>
                          </div>
                        )}

                        {performers && (
                          <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full mx-auto md:ml-0 mt-3">
                            <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
                            <span className="text-[12px] text-green-500 truncate max-w-[180px]">
                              {performers} {tr("performersText")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visit button */}
                    <div className="shrink-0">
                      <Link
                        href={`/out/${site.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-[13px] text-white uppercase font-medium rounded-md bg-black text-center py-[12px] px-[30px]"
                      >
                        {t("visit", { title: site.title })}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8">
            <Link
              href={`/${locale}/`}
              className="text-[13px] text-black underline"
            >
              {t("backToHome")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}