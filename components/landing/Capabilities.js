"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

const CAPABILITIES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
    title: "Automated Model Verification",
    description:
      "Run 200+ evaluation suites against any model checkpoint in under 4 minutes. CI/CD-native.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Real-Time Safety Monitoring",
    description:
      "Continuous production monitoring surfaces regressions within 90 seconds. Zero manual triage.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v-2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: "Expert Evaluation Network",
    description:
      "2,400+ domain-verified reviewers across 18 specializations. Human judgment at API speed.",
  },
];

export default function Capabilities() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      id="capabilities"
      className="py-24 md:py-[140px] px-6 border-t border-border-light"
      aria-label="Capabilities"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Eyebrow */}
        <p className="reveal text-[12px] uppercase tracking-[0.08em] text-text-muted mb-4 font-body">
          Core Capabilities
        </p>

        {/* Section heading */}
        <h2 className="reveal font-heading font-[400] text-[32px] md:text-[48px] leading-[1] tracking-[-2px] text-text-heading max-w-[600px] mb-12 md:mb-16">
          Three layers of model assurance.
        </h2>

        {/* Capability cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {CAPABILITIES.map((cap) => (
            <div
              key={cap.title}
              className="reveal border border-border rounded-lg p-6 md:p-8 bg-page hover:bg-surface transition-colors duration-150"
            >
              {/* Icon */}
              <div className="w-10 h-10 flex items-center justify-center text-accent mb-6">
                {cap.icon}
              </div>

              {/* Title */}
              <h3 className="font-heading font-[400] text-[18px] md:text-[20px] leading-[1.2] tracking-[-0.5px] text-text-heading mb-3">
                {cap.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] leading-[1.4] text-text-muted">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
