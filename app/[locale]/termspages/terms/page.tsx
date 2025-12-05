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

  // Use fallback SEO data since SEO section was removed
  const seoData = {
    Title: "Terms of Service",
    Description:
      "Read the Terms of Service and understand the rules and policies for using Fetish Chat.",
    Keywords: "Fetish Chat, Terms of Service, Privacy Policy, User Agreement",
  };

  // Use environment variables for URLs
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || SITE_URL;
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  
  // Use pathname if available, otherwise construct from locale
  let pageUrl = `${SITE_URL}/termspages/terms`;
  if (pathname && pathname !== "/") {
    pageUrl = `${SITE_URL}${pathname}`;
  } else {
    pageUrl = locale === "en" ? `${SITE_URL}/termspages/terms` : `${SITE_URL}/${locale}/termspages/terms`;
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
  const termsData = messages.Terms;

  // Helper function to render content with bold text support
  const renderContent = (content: string | string[]) => {
    if (Array.isArray(content)) {
      return content.map((paragraph, index) => (
        <p key={index} className="mb-4">
          {renderFormattedText(paragraph)}
        </p>
      ));
    }
    
    return <p className="mb-4">{renderFormattedText(content)}</p>;
  };

  // Helper function to handle **bold** text and links
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|www\.topchats\.com\/privacy\/|privacy@topchats\.com)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      } else if (part === 'www.topchats.com/privacy/') {
        return (
          <Link
            key={index}
            href={termsData.links.privacy}
            className="text-blue-600 hover:underline"
          >
            {part}
          </Link>
        );
      } else if (part === 'privacy@topchats.com') {
        return (
          <Link
            key={index}
            href={`mailto:${termsData.links.email}`}
            className="text-blue-600 hover:underline"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <>
      <section className="block bg-black/3">
        <div className="mx-auto max-w-[1140px]">
          <div className="block bg-white px-[15px] py-[30px] md:px-[60px]">
            <div className="flex justify-center bg-white sticky top-0 pt-[40px] md:pt-[30px]">
              <h1 className="md:text-[40px] lg:text-[80px] text-black font-bold text-center capitalize">
                {termsData.title}
              </h1>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mt-2">
                {termsData.heading}
              </h2>
              <p className="text-gray-600 mt-2">
                {termsData.lastUpdated}
              </p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {/* Acceptance of the Agreement */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {termsData.sections.acceptance.title}
                </h3>
                {renderContent(termsData.sections.acceptance.content)}
              </section>

              {/* Changes to the Agreement */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {termsData.sections.changes.title}
                </h3>
                {renderContent(termsData.sections.changes.content)}
              </section>

              {/* Accessing the Website and Account Security */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {termsData.sections.access.title}
                </h3>
                {renderContent(termsData.sections.access.content)}
              </section>

              {/* Intellectual-Property Rights */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {termsData.sections.intellectualProperty.title}
                </h3>
                {renderContent(termsData.sections.intellectualProperty.content)}
              </section>

              {/* Prohibited Uses */}
              <section className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {termsData.sections.prohibitedUses.title}
                </h3>
                {renderContent(termsData.sections.prohibitedUses.content)}
              </section>

              {/* Governing Law and Jurisdiction */}
              <section id="GoverningLaw" className="mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {termsData.sections.governingLaw.title}
                </h3>
                {renderContent(termsData.sections.governingLaw.content)}
              </section>

              {/* Footer */}
              <section className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {termsData.footer.companyInfo}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {termsData.footer.contactInfo}{" "}
                  <Link
                    href={`mailto:${termsData.links.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {termsData.links.email}
                  </Link>
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}