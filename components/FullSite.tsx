"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMessages, useTranslations, useLocale } from "next-intl";
import { Check, DollarSign, Crown } from "lucide-react";
import camSites from "@/data/sites.json";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

interface Site {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  excerpt?: string;
  features?: string[];
  hero: string;
  logo: string;
  link: string;
  performers: string;
  rating: number;
}

export default function FullSite() {
  const locale = useLocale();
  const t = useTranslations("camPost");
  const t2 = useTranslations();
  const messages = useMessages() as any;
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/images/placeholder.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    const formatted = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${SERVER_URL}${formatted}`;
  };

  // ✅ Filtered sites if a category is selected, sorted by rating (descending), maintain original order for same ratings
  const filteredSites = selectedCategory
    ? camSites
        .map((site, originalIndex) => ({ site, originalIndex }))
        .filter(({ site }) => site.categories.includes(selectedCategory))
        .sort((a, b) => {
          const ratingDiff = (b.site.rating || 0) - (a.site.rating || 0);
          // If ratings are equal, maintain original order (first in JSON stays first)
          return ratingDiff !== 0 ? ratingDiff : a.originalIndex - b.originalIndex;
        })
        .map(({ site }) => site)
    : camSites
        .map((site, originalIndex) => ({ site, originalIndex }))
        .sort((a, b) => {
          const ratingDiff = (b.site.rating || 0) - (a.site.rating || 0);
          return ratingDiff !== 0 ? ratingDiff : a.originalIndex - b.originalIndex;
        })
        .map(({ site }) => site);

  // ✅ Get unique categories (only used if showing all)
  const allCategories = Array.from(
    new Set(filteredSites.flatMap((site) => site.categories))
  );

  return (
    <section className="block py-[40px] bg-[#fafafa]">
      <div className="w-full max-w-[1030px] mx-auto px-[15px]">
        {selectedCategory ? (
          <>
            {/* 🔹 Single category view */}
            <h2 className="text-[22px] font-semibold text-black mb-4 capitalize">
              {selectedCategory.replace(/([A-Z])/g, " $1")}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {filteredSites.map((site, index) => {
                const slugMessages =
                  messages?.singlePageBySlug?.[site.slug] || {};
                const siteFeatures: string[] = Array.isArray(
                  slugMessages?.features
                )
                  ? slugMessages.features
                  : [];

                return (
                  <div
                    key={site.id || index}
                    className="flex flex-wrap gap-4 items-center bg-white py-[15px] px-[20px] rounded-md justify-center md:justify-between shadow"
                  >
                    {/* Thumbnail */}
                    <div className="grow md:grow-0 md:basis-[260px] relative">
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
                          src={getImageUrl(site.hero)}
                          alt={site.title}
                          width={500}
                          height={281}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Logo + Review Link */}
                    <div className="shrink-0 w-[150px] text-center">
                      <div className="h-[30px] mx-auto table">
                        <img
                          src={getImageUrl(site.logo)}
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

                    {/* Features */}
                    <div className="grow">
                      <div className="flex flex-col mx-auto w-auto">
                           {siteFeatures.slice(0, 3).map((feature: string, i: number) => (
                          <div key={i} className="flex gap-1 items-center">
                            <Check size={13} />
                            <span className="text-[12px] text-black capitalize truncate w-[180px]">
                              {feature}
                            </span>
                          </div>
                        ))}

                        {siteFeatures[3] && (
                          <div className="flex gap-1 items-center">
                            <DollarSign
                              size={13}
                              className="text-yellow-500"
                            />
                            <span className="text-[12px] text-black capitalize truncate w-[180px]">
                              {siteFeatures[3]}
                            </span>
                          </div>
                        )}

                        {site.performers && (
                          <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full mx-auto md:ml-0 mt-3">
                            <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
                            <span className="text-[12px] text-green-500 truncate max-w-[180px]">
                              {site.performers}{t2("performersText")}
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
          </>
        ) : (
          <>
            {/* 🔹 Default: all categories grouped */}
            {allCategories.map((category) => {
              // Get sites for this category from original camSites, then sort by rating
              const categorySites = camSites
                .map((site, originalIndex) => ({ site, originalIndex }))
                .filter(({ site }) => site.categories.includes(category))
                .sort((a, b) => {
                  const ratingDiff = (b.site.rating || 0) - (a.site.rating || 0);
                  // If ratings are equal, maintain original order (first in JSON stays first)
                  return ratingDiff !== 0 ? ratingDiff : a.originalIndex - b.originalIndex;
                })
                .map(({ site }) => site);

              if (categorySites.length === 0) return null;

              return (
                <div key={category} className="mb-[40px]">
                  <h2 className="text-[22px] font-semibold text-black mb-4 capitalize">
                    {category.replace(/([A-Z])/g, " $1")}
                  </h2>

                  <div className="grid grid-cols-1 gap-6">
                    {categorySites.map((site, index) => {
                      const slugMessages =
                        messages?.singlePageBySlug?.[site.slug] || {};
                      const siteFeatures: string[] = Array.isArray(
                        slugMessages?.features
                      )
                        ? slugMessages.features
                        : [];

                      return (
                        <div
                          key={`${category}-${site.slug || site.id || index}`}
                          className="flex flex-wrap gap-4 items-center bg-white py-[15px] px-[20px] rounded-md justify-center md:justify-between shadow"
                        >
                          {/* Thumbnail */}
                          <div className="grow md:grow-0 md:basis-[260px] relative">
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
                                src={getImageUrl(site.hero)}
                                alt={site.title}
                                width={500}
                                height={281}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>

                          {/* Logo + Review Link */}
                          <div className="shrink-0 w-[150px] text-center">
                            <div className="h-[30px] mx-auto table">
                              <img
                                src={getImageUrl(site.logo)}
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

                          {/* Features */}
                          <div className="grow">
                            <div className="flex flex-col mx-auto w-auto">
                                 {siteFeatures.slice(0, 3).map((feature: string, i: number) => (
                                <div key={i} className="flex gap-1 items-center">
                                  <Check size={13} />
                                  <span className="text-[12px] text-black capitalize truncate w-[180px]">
                                    {feature}
                                  </span>
                                </div>
                              ))}

                              {siteFeatures[3] && (
                                <div className="flex gap-1 items-center">
                                  <DollarSign
                                    size={13}
                                    className="text-yellow-500"
                                  />
                                  <span className="text-[12px] text-black capitalize truncate w-[180px]">
                                    {siteFeatures[3]}
                                  </span>
                                </div>
                              )}

                              {site.performers && (
                                <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full mx-auto md:ml-0 mt-3">
                                  <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
                                  <span className="text-[12px] text-green-500 truncate max-w-[180px]">
                                    {site.performers}{t2("performersText")}
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
                </div>
              );
            })}
          </>
        )}
      </div>
    </section>
  );
}
