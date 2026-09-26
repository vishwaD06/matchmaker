"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/useScrollReveal";

export default function FinalCTA() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      id="cta"
      className="py-24 md:py-[140px] px-6 bg-surface border-t border-border-light"
      aria-label="Get started"
    >
      <div className="mx-auto max-w-[1200px] text-center">
        <h2 className="reveal font-heading font-[400] text-[32px] md:text-[48px] leading-[1] tracking-[-2px] text-text-heading mx-auto max-w-[680px]">
          Stop guessing. Start verifying.
        </h2>

        <div className="reveal mt-10">
          <Link
            href="#"
            className="inline-flex items-center bg-accent text-white text-[16px] font-[500] px-8 py-4 rounded-lg hover:brightness-[1.08] active:brightness-[0.95] transition-all duration-150 min-h-[48px]"
          >
            Request Access
          </Link>
        </div>

        <p className="reveal text-[14px] text-text-muted mt-6">
          Free tier available · No credit card required · SOC 2 compliant
        </p>
      </div>
    </section>
  );
}
