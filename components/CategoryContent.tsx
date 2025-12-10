"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SERVER_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_SERVER_URL;

type Props = {
    category?: string;
    siteKey: string; // e.g. "topChats"
};

export default function CategoryContent({ category, siteKey }: Props) {
    const t = useTranslations(`categoryContent.${siteKey}`);

    // Get list items safely from translations
    const findList = t.raw("categoryList") as string[];
    const opinionList = t.raw("ContactList") as string[];
    return (
        <>
            <section className="block py-[40px] bg-[#fafafa]">
                <div className="w-full max-w-[1030px] mx-auto px-[15px]">
                    {/* --- Heading & Intro --- */}
                    <h2 className="text-black text-[32px] md:text-[41px] font-bold mb-[20px]">
                        {t("categoryTitle1")}
                    </h2>

                    <div className="flex flex-col md:flex-row gap-5 mb-4">
                        <div className="grow flex flex-col gap-3">
                            <p className="text-[18px] text-black font-light">{t("categoryIntro1")}</p>
                            <p className="text-[18px] text-black font-light">{t("categoryIntro2")}</p>
                        </div>

                        <div className="shrink-0">
                            <div className="inline-block w-[300px] aspect-video rounded-md overflow-hidden">
                                <img
                                    src={`${SERVER_URL}${t("categoryImage")}`}
                                    width={300}
                                    height={300}
                                    alt={t("categoryTitle1")}
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full max-w-[700px]">
                        <h3 className="text-black text-[24px] md:text-[27px] font-bold">
                            {t("categoryTitle2")}
                        </h3>
                        <p className="text-[18px] text-black font-light">{t("paragraph1")}</p>
                        <p className="text-[18px] text-black font-light">{t("paragraph2")}</p>

                        <ul className="text-[18px] text-black font-light list-disc pl-5">
                            {findList?.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>

                        <h3 className="text-black text-[24px] md:text-[27px] font-bold">
                            {t("categoryTitle3")}
                        </h3>
                        <p className="text-[18px] text-black font-light">{t("paragraph3")}</p>

                        <h3 className="text-black text-[24px] md:text-[27px] font-bold">
                            {t("categoryTitle4")}
                        </h3>
                        <p className="text-[18px] text-black font-light">{t("paragraph4")}</p>
                        <p className="text-[18px] text-black font-light">{t("paragraph5")}</p>

                        <ul className="text-[18px] text-black font-light list-disc pl-5">
                            {opinionList?.map((item, i) => (
                                <li key={i}>
                                    {i === 0 ? (
                                        <Link href="/contact" className="text-primary">
                                            {item}
                                        </Link>
                                    ) : (
                                        item
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

        </>
    )
}
