"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

const PARTNERS = [
  "DeepMind",
  "Anthropic",
  "Scale AI",
  "Cohere",
  "Mistral",
  "Stability",
];

export default function SocialProof() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-6 border-t border-border-light"
      aria-label="Trusted partners"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Eyebrow */}
        <p className="reveal text-[12px] uppercase tracking-[0.08em] text-text-muted mb-8 font-body">
          Trusted by teams at
        </p>

        {/* Partner names */}
        <div className="reveal flex flex-wrap items-center gap-x-10 gap-y-4">
          {PARTNERS.map((name) => (
            <span
              key={name}
              className="font-heading text-[20px] md:text-[24px] font-[400] text-text-heading opacity-40 select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
