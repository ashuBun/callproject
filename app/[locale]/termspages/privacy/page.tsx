import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import messagesMap from "@/messages";
import type { AppLocale } from "@/messages";
import Link from "next/link";
import { getTopSiteImageUrl } from "@/lib/getTopSiteImage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;
  const messages = messagesMap[safeLocale];

  const seoData = {
    Title: "Privacy Policy",
    Description:
      "Read the Privacy Policy to understand how Fetish Chat collects, uses, and protects your information.",
    Keywords: "Fetish Chat, Privacy Policy, Data Protection, User Information",
  };

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale
  let pageUrl = `${SITE_URL}/termspages/privacy`;
  if (pathname && pathname !== "/") {
    pageUrl = `${SITE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${SITE_URL}/termspages/privacy` : `${SITE_URL}/${locale}/termspages/privacy`;
  }

  // Get top-ranked site's hero image for og:image
  const ogImageUrl = getTopSiteImageUrl("top10chat", IMAGE_URL);

  return {
    metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
    title: seoData.Title,
    description: seoData.Description,
    keywords: seoData.Keywords,
    openGraph: {
      type: "website",
      locale: safeLocale,
      url: pageUrl,
      siteName: "Top Chats",
      title: seoData.Title,
      description: seoData.Description,
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: seoData.Title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: seoData.Title,
      description: seoData.Description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const safeLocale = (locale in messagesMap ? locale : "en") as AppLocale;
  const messages = messagesMap[safeLocale];
  const privacyMessages = messages.Privacy;

  return (
    <>
      <section className="block bg-black/3">
        <div className="mx-auto max-w-[1140px]">
          <div className="block bg-white px-[15px] pb-[30px] md:px-[60px]">
            <div className="flex justify-center bg-white sticky top-0 pt-[40px] md:pt-[30px]">
              <h1 className="md:text-[40px] lg:text-[80px] text-black font-bold text-center capitalize">
                {privacyMessages.title}
              </h1>
            </div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">{privacyMessages.companyName}</h1>
              <h2 className="text-xl font-semibold mt-2">
                {privacyMessages.websitePrivacyPolicy}
              </h2>
              <p className="text-gray-600 mt-2">
                {privacyMessages.lastUpdated}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {privacyMessages.sections.introduction.title}
                </h3>
                <p className="mb-4">
                  {privacyMessages.sections.introduction.welcome}
                </p>
                <p className="mb-4">
                  {privacyMessages.sections.introduction.respect}
                </p>
                <p>
                  {privacyMessages.sections.introduction.layeredFormat}
                </p>
              </section>

              {/* Table of Contents */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {privacyMessages.sections.toc.title}
                </h3>
                <ol className="list-decimal pl-6 space-y-2">
                  {privacyMessages.sections.toc.items.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={`#p${index + 1}`}
                        className="text-blue-600 hover:underline font-semibold"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Section 1 */}
              <section id="p1" className="mb-8 scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">
                  1- {privacyMessages.sections.section1.title}
                </h2>

                <h3 className="text-lg font-semibold mb-3">
                  {privacyMessages.sections.section1.purpose.title}
                </h3>
                <p className="mb-4">
                  {privacyMessages.sections.section1.purpose.content1}
                </p>
                <p className="mb-4">
                  {privacyMessages.sections.section1.purpose.content2}
                </p>
                <p className="mb-4">
                  {privacyMessages.sections.section1.purpose.content3}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {privacyMessages.sections.section1.controller.title}
                </h3>
                <p className="mb-4">
                  {privacyMessages.sections.section1.controller.content1}
                </p>
                <p className="mb-4">
                  {privacyMessages.sections.section1.controller.content2}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {privacyMessages.sections.section1.contact.title}
                </h3>
                <p className="mb-2">
                  {privacyMessages.sections.section1.contact.content}
                </p>
                <p className="mb-1">
                  <strong>{privacyMessages.sections.section1.contact.legalEntity.split(':')[0]}:</strong> {privacyMessages.sections.section1.contact.legalEntity.split(':')[1]}
                </p>
                <p className="mb-1">
                  <strong>{privacyMessages.sections.section1.contact.email.split(':')[0]}:</strong>&nbsp;
                  <Link
                    href="mailto:privacy@topchats.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@topchats.com
                  </Link>
                </p>
                <p className="mb-4">
                  <strong>{privacyMessages.sections.section1.contact.postal.split(':')[0]}:</strong> {privacyMessages.sections.section1.contact.postal.split(':')[1]}
                </p>
                <p className="mb-4">
                  {privacyMessages.sections.section1.contact.complaint}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {privacyMessages.sections.section1.changes.title}
                </h3>
                <p className="mb-4">
                  {privacyMessages.sections.section1.changes.content1}
                </p>
                <p className="mb-4">
                  {privacyMessages.sections.section1.changes.content2}
                </p>

                <h3 className="text-lg font-semibold mb-3">
                  {privacyMessages.sections.section1.thirdPartyLinks.title}
                </h3>
                <p>
                  {privacyMessages.sections.section1.thirdPartyLinks.content}
                </p>
              </section>

              {/* Continue with remaining sections following the same pattern */}
              {/* You would need to add the corresponding translations for sections 2-14 in the JSON files */}

              {/* Footer */}
              <section className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {privacyMessages.footer.lastUpdated}&nbsp;
                  <Link
                    href="mailto:privacy@topchats.com"
                    className="text-blue-600 hover:underline"
                  >
                    privacy@topchats.com
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}