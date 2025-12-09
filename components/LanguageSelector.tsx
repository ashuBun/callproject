"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { ChevronDown } from "lucide-react";

const SERVER_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_SERVER_URL;

const languages = [
  { code: "en", name: "English", flag:  `${SERVER_URL}/flags/en.svg` },
  { code: "fr", name: "Français", flag: `${SERVER_URL}/flags/fr.svg`}, 
  { code: "de", name: "Deutsch", flag: `${SERVER_URL}/flags/de.svg`},
  { code: "es", name: "Español", flag: `${SERVER_URL}/flags/es.svg`},
  { code: "ar", name: "العربية", flag: `${SERVER_URL}/flags/ar.svg`},
  { code: "hi", name: "हिन्दी", flag: `${SERVER_URL}/flags/hi.svg`},
  { code: "it", name: "Italiano", flag: `${SERVER_URL}/flags/it.svg`},
  { code: "ru", name: "Русский", flag: `${SERVER_URL}/flags/ru.svg`},
  { code: "zh", name: "中文", flag: `${SERVER_URL}/flags/zh.svg`},
  { code: "tr", name: "Türkçe", flag: `${SERVER_URL}/flags/tr.svg`},
  { code: "nl", name: "Nederlands", flag: `${SERVER_URL}/flags/nl.svg`},
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    // Navigate to new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center font-medium transition duration-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:outline-gray-400 enabled:hover:border-gray-400 gap-2 cursor-pointer text-white hover:bg-[var(--primary)]/0.8 text-[14px] py-[8px] px-[10px]"
      >
        <img
          src={currentLanguage.flag}
          alt={currentLanguage.name}
          width={20}
          height={20}
          className=""
        />
        <span>{currentLanguage.name}</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 w-full min-w-[150px] bg-white border border-gray-300 shadow-lg z-[992] rounded-md overflow-hidden">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3 transition-colors cursor-pointer ${
                  language.code === locale ? "bg-gray-50 font-medium" : ""
                }`}
              >
                <img
                  src={language.flag}
                  alt={language.name}
                  width={18}
                  height={18}
                  className=""
                />
                <span className="text-[13px]">{language.name}</span>
                {language.code === locale && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
