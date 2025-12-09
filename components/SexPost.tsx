import Image from "next/image";
import Link from "next/link";
import { Check, DollarSign, Crown  } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
const SERVER_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_SERVER_URL || "";

interface CamPostProps {
  index: number;
  title: string;
  logo: string;
  hero: string;
  reviewUrl: string;
  visitUrl: string;
  features?: string[];
}

export default function SexPost({
  index,
  title,
  logo,
  hero,
  reviewUrl,
  visitUrl,
  features = [],
}: CamPostProps) {
  const t = useTranslations("camPost");
  const locale = useLocale();
  return (
    <div className="flex flex-wrap gap-4 items-center bg-white py-[15px] px-[20px] rounded-md">
      {/* Thumbnail with index */}
      <div className="grow">
        <div className="aspect-video w-full rounded-md overflow-hidden relative md:w-[300px]">
           <h2 className="text-black aspect-square w-[40px] absolute top-1/2 left-0 transform -translate-y-1/2 z-[3] bg-yellow-500 rounded-r-full text-center leading-[35px] font-semibold text-[14px] grid place-items-center">
            <span className="relative">
            {index === 0 && <Crown size={13} className="absolute top-[-2px] left-1/2 -translate-x-1/2" />}
            <span className="">{index + 1}</span>
            </span>
          </h2>
          <img
            src={`${SERVER_URL}${hero}`}
            alt={title}
            width={500}
            height={281}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Logo + review link */}
      <div className="shrink-0 w-[200px] text-center">
        <div className="h-[30px] mx-auto table">
          <img
           src={`${SERVER_URL}${logo}`}
            width={192}
            height={50}
            alt={`${title} logo`}
            className="h-full mx-auto"
          />
        </div>
        <Link
          href={`/${locale}/singlepage`}
          className="text-black underline uppercase text-[12px] hover:text-[var(--primary)]"
        >
          {t("readReview")}
        </Link>
      </div>

      {/* Feature list */}
      <div className="grow">
        <div className="flex flex-col mx-auto w-auto">
          {features.slice(0, 3).map((f) => (
            <div key={f} className="flex gap-1 items-center">
              <Check size={13} />
              <span className="text-[12px] text-black capitalize truncate w-[180px]">{f}</span>
            </div>
          ))}

          {features[3] && (
            <div className="flex gap-1 items-center">
              <DollarSign size={13} className="text-yellow-500" />
              <span className="text-[12px] text-black capitalize truncate w-[180px]">
                {features[3]}
              </span>
            </div>
          )}

          <div className="w-auto self-start flex gap-2 items-center border border-green-500 py-[2px] px-[6px] rounded-full mt-3">
            <span className="bg-green-500 aspect-square h-[8px] rounded-full"></span>
            <span className="text-[12px] text-green-500">
              {features[4] ?? "Active users"}
            </span>
          </div>
        </div>
      </div>

      {/* Visit button */}
      <div className="shrink-0">
        <Link
          href={`/out/${encodeURIComponent(visitUrl)}`}
          className="block text-[13px] text-white uppercase font-medium rounded-md bg-black text-center py-[12px] px-[30px]"
        >
          {t("visit", { title })}
        </Link>
      </div>
    </div>
  );
}
