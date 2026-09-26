"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Platform", href: "#product" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Research", href: "#features" },
  { label: "Company", href: "#cta" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled
          ? "bg-page/95 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-[1200px] px-6 h-[72px] flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-heading text-[20px] font-[500] tracking-[-0.5px] text-text-heading"
        >
          Arcline Labs
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-text-muted hover:text-text-heading transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link
          href="#cta"
          className="hidden md:inline-flex items-center bg-accent text-white text-[14px] font-[500] px-6 py-3 rounded-lg hover:brightness-[1.08] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Request Access
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden w-11 h-11 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="relative w-5 h-4">
            <span
              className={`absolute left-0 w-5 h-[1.5px] bg-text-heading transition-all duration-200 ${
                menuOpen ? "top-[7px] rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 w-5 h-[1.5px] bg-text-heading transition-all duration-200 ${
                menuOpen ? "opacity-0" : "top-[7px]"
              }`}
            />
            <span
              className={`absolute left-0 w-5 h-[1.5px] bg-text-heading transition-all duration-200 ${
                menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Full-Screen Overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-page z-40">
          <nav className="flex flex-col items-start px-6 pt-12 gap-8" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-heading text-[32px] font-[400] tracking-[-1px] text-text-heading hover:text-accent transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#cta"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center bg-accent text-white text-[16px] font-[500] px-6 py-3 rounded-lg"
            >
              Request Access
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
