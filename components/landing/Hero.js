"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function Hero() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="min-h-svh flex flex-col justify-center px-6"
      aria-label="Hero"
    >
      <div className="mx-auto max-w-[1200px] w-full pt-[72px]">
        {/* Eyebrow */}
        <p className="reveal text-[12px] uppercase tracking-[0.08em] text-text-muted mb-8 font-body">
          Verification &amp; Evaluation Infrastructure
        </p>

        {/* H1 */}
        <h1 className="reveal font-heading font-[400] text-[34px] md:text-[50px] leading-[1] tracking-[-2px] text-text-heading max-w-[820px]">
          Precision infrastructure for frontier AI systems.
        </h1>

        {/* Supporting line */}
        <p className="reveal text-[16px] leading-[1.3] text-text-muted max-w-[520px] mt-6">
          Automated verification, human-calibrated evaluation, and alignment tooling — built for teams shipping models at scale.
        </p>

        {/* CTAs */}
        <div className="reveal flex flex-wrap items-center gap-3 mt-10">
          <Link
            href="#cta"
            className="inline-flex items-center bg-accent text-white text-[14px] font-[500] px-6 py-3 rounded-lg hover:brightness-[1.08] active:brightness-[0.95] transition-all duration-150 min-h-[44px]"
          >
            Request Access
          </Link>
          <Link
            href="#product"
            className="inline-flex items-center bg-transparent border border-border text-text text-[14px] font-[500] px-6 py-3 rounded-lg hover:border-text-muted transition-all duration-150 min-h-[44px]"
          >
            See the Platform
          </Link>
        </div>
      </div>
    </section>
  );
}
