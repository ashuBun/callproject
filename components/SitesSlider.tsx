"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import the JSON data from the data folder
import sitesData from "../data/sites.json";

const Slider: any = dynamic(() => import("react-slick"), { ssr: false });

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// Site / Card types
interface SiteFull {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  hero?: string;
  logo?: string;
  link?: string;
  performers?: string;
  rating?: number;
  featureImage?: string;
  benefitImage?: string;
  // other fields omitted for brevity...
}

interface CardData {
  hero?: string;
  logo?: string;
  title: string;
  visitUrl?: string;
  reviewUrl?: string;
  rating: number;
  slug: string;
}

// Custom Arrow Components
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute right-0 top-[-55px] z-10 cursor-pointer text-black"
    onClick={onClick}
  >
    <ChevronRight size={32} />
  </div>
);

const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute right-[40px] top-[-55px] z-10 cursor-pointer text-black"
    onClick={onClick}
  >
    <ChevronLeft size={32} />
  </div>
);

// Card Component
const Card = ({ hero, logo, title, visitUrl, reviewUrl, rating, slug }: CardData) => {
  const locale = useLocale();
  const t = useTranslations();
  const heroSrc = hero?.startsWith("http") ? hero : `${SERVER_URL}${hero}`;
  const logoSrc = logo?.startsWith("http") ? logo : `${SERVER_URL}${logo}`;
  return (
    <div className="flex flex-col gap-3 shadow-md border border-slate-100 bg-white rounded-sm p-[14px]">
      <Link
        href={visitUrl || "/"}
        className="mx-auto w-[116px] aspect-square rounded-full bg-[#fafafa] p-[6px] overflow-hidden"
      >
        {hero ? (
          <img
            src={heroSrc}
            width={100}
            height={100}
            className="w-full h-full object-cover rounded-full"
            alt={`${title} hero image`}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-full" />
        )}
      </Link>

      <Link href={visitUrl || "/"} className="mx-auto h-[35px]">
        {logo ? (
          <img
            src={logoSrc}
            width={100}
            height={100}
            className="h-full w-auto"
            alt={`${title} logo image`}
          />
        ) : (
          <div className="h-full w-[80px] bg-gray-50" />
        )}
      </Link>

      <Link
        href={visitUrl || "/"}
        className="block mt-1 text-[13px] text-white uppercase font-medium rounded-md bg-black text-center py-[6px]"
      >
       {t("visit")} 
      </Link>

        <Link
          href={`/${locale}/site/${slug}`}
          className="text-black underline uppercase text-[12px] hover:text-[var(--primary)] mx-auto"
        >
        {t("readReview")}
      </Link>

      <div className="flex justify-center gap-1 items-center">
        {Array.from({ length: Math.max(0, rating || 0) }).map((_, index) => (
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
    </div>
  );
};

// YouLike Component
interface YouLikeProps {
  category: string;
}

export default function SitesSlider({ category }: YouLikeProps) {
  // cast imported JSON to SiteFull[]
  const sites = sitesData as SiteFull[];

  const getPerformersCount = (performers: string | undefined): number => {
    if (!performers) return 0;

    const numStr = performers.replace(/[,+\s]/g, "");
    const num = parseInt(numStr, 10);
    return isNaN(num) ? 0 : num;
  };

  // Filter + sort + map to CardData (make sure to include rating)
  const filteredCards: CardData[] = sites
    .map((site, originalIndex) => ({ site, originalIndex }))
    .filter(
      ({ site }) =>
        Array.isArray(site.categories) && site.categories.includes(category)
    )
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
    .map(({ site }) => ({
      hero: site.hero,
      logo: site.logo,
      title: site.title,
      visitUrl: `/out/${site.slug}`, // Use redirect system instead of direct link
      reviewUrl: `/reviews/${site.slug}`, // keep your expected review URL pattern
      rating: site.rating ?? 0, // <-- pass rating here
      slug: site.slug, // <-- pass slug here
    }));

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: Math.min(4, filteredCards.length),
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: Math.min(3, filteredCards.length),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: Math.min(2, filteredCards.length),
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
           
          },
        },
      ],
    };
    

  // if no cards, render nothing (or you can return a placeholder)
  if (filteredCards.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-[40px] relative">
      <div className="px-[15px] mx-auto w-full max-w-[1030px]">
        <h3 className="text-black text-[27px] font-bold uppercase mb-5">
          You Might Like
        </h3>

        <Slider {...settings}>
          {filteredCards.map((card, index) => (
            <div key={card.title + index} className="px-[10px] py-[6px]">
              <Card {...card} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
