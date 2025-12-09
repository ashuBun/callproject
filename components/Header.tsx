"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Search, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";

const SERVER_URL = process.env.NEXT_PUBLIC_IMG_URL || process.env.NEXT_PUBLIC_IMAGE_URL || process.env.NEXT_PUBLIC_SERVER_URL;

export default function Header() {
  const t = useTranslations("Header.nav");
  const tSearch = useTranslations("Header.search");
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navLinks = [
    { key: "top10", href: "/" },
    { key: "sexCams", href: "/sexcams" },
    { key: "freeChat", href: "/freechat" },
    { key: "milfChat", href: "/milfchat" },
    { key: "bbwChat", href: "/bbwchat" },
    { key: "ebonyChat", href: "/ebonychat" },
    { key: "teenChat", href: "/teenchat" },
    { key: "randomChat", href: "/randomchat" },
    { key: "fetishChat", href: "/fetishchat" },
    { key: "voyeurCam", href: "/voyeurcam" },
  ];

  const pathname = usePathname();
  const normalizedPath = pathname.replace(/^\/[a-zA-Z-]+(\/|$)/, "/");

  return (
    <>
      {/* Top red bar */}
      <div className="block sticky top-0 md:relative z-[990] py-2 bg-black">
        <div className="w-full max-w-[1140px] mx-auto px-[15px]">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="text-white focus:outline-none cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link
                href={`/${locale}/`}
                className="flex items-center cursor-pointer text-white transition-transform duration-100 active:opacity-90 active:translate-y-0.5 w-[140px]"
              >
                <img
                  src={`${SERVER_URL}/logos/logo.svg`}
                  alt="logo"
                  className="w-full"
                  width={100}
                  height={100}
                />
              </Link>
            </div>

            {/* Desktop Language Selector */}
            <div className="hidden md:inline-block">
              <LanguageSelector />
            </div>

            {/* Mobile Search Toggle */}
            <div className="inline-block md:hidden">
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className="text-white cursor-pointer"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Items */}
          {isMenuOpen && (
            <div className="fixed top-[44px] left-0 right-0 z-[990] flex flex-col gap-4 bg-black p-4">
              <div className="flex flex-col">
                <LanguageSelector />
                {navLinks.map(({ key, href }) => {
                  const isActive =
                    href === "/"
                      ? normalizedPath === "/"
                      : normalizedPath.startsWith(href);

                  return (
                    <Link
                      prefetch={false}
                      onClick={() => setIsMenuOpen(false)}
                      key={key}
                      href={`/${locale}${href}`}
                      className={`text-[14px] py-[10px] text-white hover:text-[var(--accent)] ${
                        isActive
                          ? "border-[var(--primary)] text-[var(--accent)]"
                          : "border-transparent "
                      }`}
                    >
                      {t(key)}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Black Nav Bar */}
      <div className="sticky top-0 z-[100]">
        <div className="hidden lg:block bg-[var(--primary)] ">
          <div className="w-full max-w-[1140px] mx-auto px-[15px]">
            <div className="flex gap-3 items-center justify-between">
              {navLinks.map(({ key, href }) => {
                const isActive =
                  href === "/"
                    ? normalizedPath === "/"
                    : normalizedPath.startsWith(href);

                return (
                  <Link
                    key={key}
                    prefetch={false}
                    href={`/${locale}${href}`} // ✅ locale + real href
                    className={`text-[14px] py-[10px] hover:text-[var(--accent)] ${
                      isActive
                        ? "text-[var(--accent)] hover:text-[var(--accent)]"
                        : "text-white hover:text-[var(--accent)]"
                    }`}
                  >
                    {t(key)} {/* ✅ translated label */}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => setShowSearch((prev) => !prev)}
                className="text-white cursor-pointer"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="block bg-[#121319] py-[10px]">
            <div className="w-full max-w-[1030px] mx-auto px-[15px]">
              <div className="flex justify-center">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const input = form.querySelector(
                      "input[name=search]"
                    ) as HTMLInputElement | null;
                    const q = (input?.value || "").trim();
                    if (!q) return;
                    window.location.href = `/${locale}/search?q=${encodeURIComponent(
                      q
                    )}`;
                  }}
                  className="w-full md:w-auto"
                >
                  <div className="flex overflow-hidden rounded-full w-full md:w-[600px]">
                    <input
                      type="text"
                      name="search"
                      className="grow text-[14px] py-[6px] px-[14px] text-black bg-white border-none focus:outline-none focus:ring-0"
                      placeholder={tSearch("placeholder")}
                    />
                    <button
                      type="submit"
                      className="shrink-0 text-white text-[14px] py-[6px] px-[30px] bg-[var(--primary)] font-medium uppercase cursor-pointer"
                    >
                      {tSearch("button")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
