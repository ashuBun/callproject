"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale, useMessages } from "next-intl";
import { Check, DollarSign, Crown } from "lucide-react";

import camSites from "@/data/sites.json"; // Your JSON data
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
type Props = {
  category?: string;
  siteKey: string;
};

export default function CamGrid({ category, siteKey }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const messages = useMessages() as any;
  const t = useTranslations();

  const postlabel: string[] =
    messages?.singlePageBySlug?.[siteKey]?.features || [];

  const realCategory = category || "top10chat";


  const getPerformersCount = (performers: string | undefined): number => {
    if (!performers) return 0;

    const numStr = performers.replace(/[,+\s]/g, "");
    const num = parseInt(numStr, 10);
    return isNaN(num) ? 0 : num;
  };


  const filteredSites = camSites
    .map((site, originalIndex) => ({ site, originalIndex }))
    .filter(({ site }) => site.categories?.includes(realCategory))
    .sort((a, b) => {
      const aRating = a.site.rating || 0;
      const bRating = b.site.rating || 0;


      if (aRating === bRating) {
        const aPerformers = getPerformersCount(a.site.performers);
        const bPerformers = getPerformersCount(b.site.performers);


        if (aPerformers === bPerformers) {
          return a.originalIndex - b.originalIndex;
        }


        return bPerformers - aPerformers;
      }


      if (aRating === 5) return -1;
      if (bRating === 5) return 1;


      return bRating - aRating;
    })
    .map(({ site }) => site)
    .slice(0, 7);


  const gridLayouts = [
    "col-span-1 sm:col-span2 md:col-span-12 lg:col-span-12",
    " md:col-span-3 lg:col-span-4",
    " md:col-span-3 lg:col-span-4",
    " md:col-span-3 lg:col-span-4",
    " md:col-span-3 lg:col-span-4",
    " md:col-span-3 lg:col-span-4",
    " md:col-span-3 lg:col-span-4",
  ];
  return (
    <>
      <section className="block pt-[60px] pb-[30px] bg-[#fafafa]">
        <div className="w-full max-w-[1030px] mx-auto px-[15px]">
          <div className=" bg-white p-4 shadow rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 w-full">
              {filteredSites.map((site, index) => {
                const slugMessages = messages?.singlePageBySlug?.[site.slug] || {};
                const postlabel = Array.isArray(slugMessages?.postlabel)
                  ? (slugMessages.postlabel as string[])
                  : [];
                const performers =
                  (slugMessages?.performers as string) ||
                  site.performers ||
                  "10,000+";

                // Always use /out/ route for tracking and country-based redirects
                const visitUrl = `/out/${site.slug}`;

                const gridClass = gridLayouts[index % gridLayouts.length];

                // ✅ If index is 1, return a completely different layout
                if (index === 0) {
                  return (
                    <div
                      key={site.id ?? index}
                      className="col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-12 bg-white rounded-lg text-black relative overflow-hidden hover:scale-[1.02] transition-all shadow-lg border-yellow-500 border-2"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden ">
                        {/* Hero image */}
                        <div className="relative w-full md:w-1/3 aspect-[16/12] rounded-l-lg overflow-hidden h-full shrink-0 md:min-h-[300px]">
                          <img
                            src={`${SERVER_URL}${site.hero}`}
                            alt={site.title}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute bottom-0 left-0 right-0 z-[10] backdrop-blur-[10px] bg-white/50 p-2 flex flex-col">
                            <div className="flex justify-between items-center gap-2">
                              <h2 className="text-black aspect-square w-[40px] bg-white group-hover:bg-black group-hover:text-white rounded-full text-center leading-[35px] font-semibold text-[16px] grid place-items-center shrink-0">
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
                              <div className="h-[40px]">
                                <img
                                  src={`${SERVER_URL}${site.logo}`}
                                  alt={`${site.title} logo`}
                                  className="h-full w-auto "
                                />
                              </div>

                              <Link
                                href={`/${locale}/site/${site.slug}`}
                                className="text-black underline uppercase text-[12px] hover:text-[var(--primary)]"
                              >
                                {t("readReview")}
                              </Link>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between grow p-4 gap-3">
                          <div className="flex-1 flex flex-col items-start gap-3">
                            <div className="text-sm space-y-1">
                              {postlabel
                                .slice(0, 3)
                                .map((postlabel: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 ">
                                    <Check size={14} className="shrink-0" />
                                    <span className="truncate w-[180px] md:w-[280px] capitalize">
                                      {postlabel}
                                    </span>
                                  </div>
                                ))}
                              {postlabel
                                .slice(3, 4)
                                .map((postlabel: string, i: number) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-2 truncate w-[180px] md:w-[280px]"
                                  >
                                    <DollarSign
                                      size={13}
                                      className="text-yellow-500 shrink-0"
                                    />

                                    <span className="truncate w-[180px] md:w-[280px] capitalize">
                                      {postlabel}
                                    </span>
                                  </div>
                                ))}
                            </div>
                            <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full">
                              <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
                              <span className="text-[12px] text-green-500 capitalize">
                                {performers} {t("performersText")}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0">
                            <Link
                              target="_blank"
                              rel="noopener noreferrer"
                              href={visitUrl}
                              className="inline-block text-[13px] text-white uppercase font-medium rounded-md bg-black text-center py-[6px] transition-colors w-full md:w-[192px]"
                            >
                              {t("visit")}
                              {/* {site.title} */}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                // 🔹 Default card layout for all others
                return (
                  <div
                    key={site.id ?? index}
                    className={`${gridClass} relative rounded-md overflow-hidden transition-all hover:scale-[1.02] shadow`}
                  >
                    <div className="flex flex-col overflow-hidden group h-full">
                      {/* hover info */}
                      <div className="absolute inset-0 z-[7] bg-white px-[15px] pt-[25px] pb-[15px] hidden group-hover:block">
                        <div className="flex justify-center">
                          <div className="flex flex-col mx-auto w-auto gap-1">
                            {postlabel
                              .slice(0, 3)
                              .map((postlabel: string, i: number) => (
                                <div key={i} className="flex gap-1 items-center">
                                  <Check size={13} />
                                  <span className="text-[12px] text-black capitalize truncate w-[180px]">
                                    {postlabel}
                                  </span>
                                </div>
                              ))}
                            {postlabel
                              .slice(3, 4)
                              .map((postlabel: string, i: number) => (
                                <div key={i} className="flex gap-1 items-center">
                                  <DollarSign
                                    size={13}
                                    className="text-yellow-500"
                                  />
                                  <span className="text-[12px] text-black capitalize truncate w-[180px]">
                                    {postlabel}
                                  </span>
                                </div>
                              ))}
                            <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full mt-3">
                              <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
                              <span className="text-[12px] text-green-500 capitalize">
                                {performers} {t("performersText")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* image + bottom bar */}
                      <div className="relative h-full">
                        <div className="relative w-full aspect-square">
                          <img
                            src={`${SERVER_URL}${site.hero}`}
                            width={500}
                            height={500}
                            alt={site.title}
                            className="w-full h-full object-cover aspect-square"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 z-[10] backdrop-blur-[10px] bg-white/50 p-2 flex flex-col">
                          <div className="flex justify-between items-center gap-2">
                            <h2 className="text-black aspect-square w-[40px] bg-white group-hover:bg-black group-hover:text-white rounded-full text-center leading-[35px] font-semibold text-[16px] grid place-items-center shrink-0">
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
                            <div className="h-[40px]">
                              <img
                                src={`${SERVER_URL}${site.logo}`}
                                alt={`${site.title} logo`}
                                className="h-full w-auto "
                              />
                            </div>

                            <Link
                              href={`/${locale}/site/${site.slug}`}
                              className="text-black underline uppercase text-[12px] hover:text-[var(--primary)]"
                            >
                              {t("readReview")}
                            </Link>
                          </div>
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={visitUrl}
                            className="block mt-1 text-[13px] text-white uppercase font-medium rounded-md bg-black text-center py-[6px] transition-colors"
                          >

                            {t("visit")}
                            {/* {t2("visit")} */}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() =>
                router.push(`/${locale}/sites?category=${realCategory}`)
              }
              type="button"
              className=" bg-[var(--primary)] text-white text-[14px] rounded-md py-[10px] px-[20px] cursor-pointer"
            >
              {t("viewMoreTitle")}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
