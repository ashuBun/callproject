"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { Check } from "lucide-react";
import camSites from "@/data/sites.json";

const SERVER_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

interface SinglePageProps {
  pageKey?: string;
  visitUrl?: string;
  title?: string;
}

export default function SinglePage({
  pageKey,
  visitUrl,
  title,
}: SinglePageProps) {
  const tr = useTranslations();
  const messages = useMessages() as any;
  // ✅ Handle undefined pageKey
  if (!pageKey) {
    return (
      <section className="block">
        <div className="w-full max-w-[1030px] mx-auto px-[15px]">
          <div className="flex flex-col gap-3 md:flex-row-reverse py-[60px]">
            <div className="grow bg-white p-[15px] rounded-md">
              <div className="flex flex-col gap-3">
                <h1 className="text-[var(--primary)] text-[27px] md:text-[34px] font-bold">
                  Sites
                </h1>
                <p className="text-black text-[18px]">
                  Please select a specific site to view its details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ✅ General "singlePage" translations
  const t = (key: string, values?: Record<string, unknown>) =>
    tr(`singlePage.${key}` as any, values as any);

  // ✅ Slug-specific translations with graceful fallback to singlePage
  const getSlugText = (key: string, values?: Record<string, unknown>) => {
    const maybe = tr(
      `singlePageBySlug.${pageKey}.${key}` as any,
      values as any
    );
    if (typeof maybe === "string" && maybe.startsWith(`singlePageBySlug.`)) {
      return t(key, values);
    }
    return maybe;
  };

  // ✅ Get site data
  const site = camSites.find((s: any) => s.slug === pageKey) || camSites[0];
  const slugMessages = messages?.singlePageBySlug?.[pageKey] as any || {};
  const localizedFeatures: string[] = Array.isArray(slugMessages?.features)
    ? slugMessages.features
    : [];

  // ✅ Always use /out/ route for tracking and country-based redirects
  const effectiveUrl = visitUrl || `/out/${site.slug}` || "/";

  // ✅ Helper function to get full image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/images/placeholder.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a relative path
    const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // If SERVER_URL is set, use it; otherwise use relative path (for Next.js public folder)
    if (SERVER_URL) {
      return `${SERVER_URL}${formattedPath}`;
    }
    
    // Return relative path (Next.js will serve from public folder)
    return formattedPath;
  };

  return (
    <section className="block">
      <div className="w-full max-w-[1030px] mx-auto px-[15px]">
        <div className="flex flex-col gap-3 md:flex-row-reverse py-[60px]">
          {/* SIDEBAR */}
          <div className="shrink-0">
            <div className="flex flex-col sticky top-[100px]">
              <div className="flex flex-col gap-2">
                {/* Hero image */}
                <div className="block w-full md:w-[300px] aspect-video rounded-md overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={getImageUrl(site.hero)}
                    width={300}
                    height={100}
                    alt={`${site.title} hero image`}
                  />
                </div>

                {/* Logo */}
                <div className="flex justify-center mt-[-35px]">
                  <div className="h-[45px] w-auto shadow rounded-full bg-white py-[6px] px-[20px]">
                    <img
                      src={getImageUrl(site.logo)}
                      width={100}
                      height={100}
                      className="h-full object-contain"
                      alt={`${site.title} logo`}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: site.rating || 0 }).map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="icon icon-tabler icons-tabler-filled icon-tabler-star text-yellow-500"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
                    </svg>
                  ))}
                </div>

                {/* Performers */}
                <div className="flex justify-center">
                  <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full mx-auto">
                    <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
                    <span className="text-[12px] text-green-500">
                      {site.performers.trim()}{" "}{tr("performersText")}
                    </span>
                  </div>
                </div>

                {/* Visit Button */}
                <div className="flex justify-center mt-2">
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={effectiveUrl}
                    className="block mt-1 text-[14px] text-white uppercase font-medium rounded-md bg-black text-center p-[8px] min-w-[250px]"
                  >
                    {t("visit")} 
                    {/* {site.title} */}
                  </Link>
                </div>
              </div>

              {/* ✅ Table of Contents */}
              <div className="flex flex-col gap-3 mt-[60px]">
                <h3 className="text-black text-[27px] font-bold">
                  {t("contents")}
                </h3>
                <ol className="flex flex-col gap-3 list-decimal list-inside">
                  <li>
                    <Link
                      href="#top"
                      className="text-[14px] text-slate-500 capitalize hover:text-[var(--primary)] focus:text-[var(--primary)]"
                    >
                      {t("overviewVerdict")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#features"
                      className="text-[14px] text-slate-500 capitalize hover:text-[var(--primary)] focus:text-[var(--primary)]"
                    >
                      {t("featuresUserBenefits")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#pricing"
                      className="text-[14px] text-slate-500 capitalize hover:text-[var(--primary)] focus:text-[var(--primary)]"
                    >
                      {t("pricingHiddenFees")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#drawbacks"
                      className="text-[14px] text-slate-500 capitalize hover:text-[var(--primary)] focus:text-[var(--primary)]"
                    >
                      {t("drawbacksComplaints")}
                    </Link>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="grow bg-white p-[15px] rounded-md">
            <div className="flex flex-col gap-3">
              <h1 className="text-[var(--primary)] text-[27px] md:text-[34px] font-bold">
                <span className="capitalize">{title}</span>{" "}
              </h1>

              <p className="text-black text-[18px]" id="top">
                {getSlugText("toppara", { title })}
              </p>

              {/* Verdict */}
              <div className="flex flex-col gap-2">
                <h4 className="text-black text-[27px] font-bold">
                  {t("verdict")}
                </h4>
                <p className="text-black text-[18px]">
                  {getSlugText("secppara", { title })}
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-col gap-2">
                <h4 className="text-black text-[27px] font-bold" id="features">
                  {t("featureTitle")}
                </h4>
                <div className="flex flex-col gap-2">
                  {localizedFeatures.map((feature, index) => (
                    <div key={index} className="flex gap-1">
                      <Check size={18} className="shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="block  rounded-md overflow-hidden aspect-video">
                <img
                  src={getImageUrl((slugMessages?.featureImage as string) || site.hero)}
                  className="h-full w-full object-cover"
                  width={600}
                  height={300}
                  alt={`${title} feature image`}
                />
              </div>

              <div className="flex justify-center">
                <Link
                target="_blank"
                rel="noopener noreferrer"
                  href={effectiveUrl}
                  className="text-white text-[14px] uppercase bg-[var(--primary)] py-[14px] px-[30px] rounded-md inline-block min-w-[200px] text-center font-medium"
                >
                  {t("watchCamsNow")}
                </Link>
              </div>

              {/* User Benefits */}
              <div className="flex flex-col gap-2">
                <h4 className="text-black text-[27px] font-bold">
                  {t("userBenefits")}
                </h4>
                <div className="flex flex-col gap-2">
                  {(slugMessages.benefits || []).map(
                    (benefit: string, index: number) => (
                      <div key={index} className="flex gap-1">
                        <Check size={18} className="shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
              
              <div className="block  rounded-md overflow-hidden aspect-video">
                <img
                  src={getImageUrl((slugMessages?.benefitImage as string) || site.hero)}
                  className="h-full w-full object-cover"
                  width={600}
                  height={300}
                  alt={`${title} benefit image`}
                />
              </div>

              <div className="flex justify-center">
                <Link
                target="_blank"
                rel="noopener noreferrer"
                  href={effectiveUrl}
                  className="text-white text-[14px] uppercase bg-[var(--primary)] py-[14px] px-[30px] rounded-md inline-block min-w-[200px] text-center font-medium"
                >
                  {t("watchCamsNow")}
                </Link>
              </div>

              {/* Pricing */}
              <div className="flex flex-col gap-2" id="pricing">
                <h4 className="text-black text-[27px] font-bold">
                  {t("pricingTitle")}
                </h4>
                <div className="flex gap-2">
                  <span className="shrink-0">💳</span>
                  <p className="text-black text-[18px]">
                    {getSlugText("pricingDescription")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0">😎</span>
                  <p className="text-black text-[18px]">
                    {getSlugText("hiddenFees")}
                  </p>
                </div>
              </div>

              {/* Drawbacks */}
              <div className="flex flex-col gap-2" id="drawbacks">
                <h4 className="text-black text-[27px] font-bold">
                  {t("drawbacksTitle")}
                </h4>
                <p className="text-black text-[18px]">
                  {getSlugText("drawbacksDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}