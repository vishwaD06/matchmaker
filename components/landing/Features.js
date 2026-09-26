"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

const FEATURES = [
  {
    eyebrow: "Evaluation Pipeline",
    heading: "Ship models with evidence, not intuition.",
    copy: "Every release backed by quantitative safety and quality scores. Arcline integrates into your existing CI pipeline with a single YAML block.",
    visual: (
      /* Abstract data visualization — stacked metric bars */
      <div className="w-full aspect-[4/3] border border-border rounded-lg bg-surface p-6 md:p-8 flex flex-col justify-end gap-3">
        {[
          { label: "Factuality", pct: 97, color: "bg-accent" },
          { label: "Safety", pct: 89, color: "bg-warm-400" },
          { label: "Coherence", pct: 94, color: "bg-neutral-300" },
          { label: "Instruction", pct: 91, color: "bg-accent" },
        ].map((bar) => (
          <div key={bar.label}>
            <div className="flex justify-between text-[12px] text-text-muted mb-1 font-body">
              <span>{bar.label}</span>
              <span>{bar.pct}%</span>
            </div>
            <div className="h-2 bg-border-light rounded-full overflow-hidden">
              <div
                className={`h-full ${bar.color} rounded-full`}
                style={{ width: `${bar.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: "Alignment Toolkit",
    heading: "Detect drift before your users do.",
    copy: "Continuous alignment monitoring compares production outputs against your policy spec. Regressions trigger automated holds.",
    visual: (
      /* Abstract timeline/pulse visualization */
      <div className="w-full aspect-[4/3] border border-border rounded-lg bg-surface p-6 md:p-8 flex flex-col justify-center">
        <div className="flex items-end gap-[3px] h-24">
          {Array.from({ length: 32 }, (_, i) => {
            const heights = [30, 45, 35, 55, 40, 60, 50, 70, 45, 65, 55, 75, 50, 80, 60, 85, 55, 70, 62, 78, 58, 72, 65, 42, 38, 28, 48, 55, 62, 68, 72, 80];
            const h = heights[i] || 40;
            const isAlert = i === 23;
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm ${isAlert ? "bg-[#febc2e]" : "bg-accent/30"}`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-[11px] text-text-muted font-body">7 days ago</span>
          <span className="text-[11px] text-text-muted font-body">Now</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
          <span className="text-[12px] text-text-muted font-body">
            Drift event detected — Sep 18, 14:32 UTC
          </span>
        </div>
      </div>
    ),
  },
];

export default function Features() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      id="features"
      className="py-24 md:py-[140px] px-6"
      aria-label="Features"
    >
      <div className="mx-auto max-w-[1200px] flex flex-col gap-24 md:gap-[96px]">
        {FEATURES.map((feat, i) => (
          <div
            key={feat.heading}
            className={`reveal grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center ${
              i % 2 === 1 ? "md:[direction:rtl]" : ""
            }`}
          >
            {/* Text */}
            <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
              <p className="text-[12px] uppercase tracking-[0.08em] text-text-muted mb-4 font-body">
                {feat.eyebrow}
              </p>
              <h2 className="font-heading font-[400] text-[28px] md:text-[48px] leading-[1] tracking-[-2px] text-text-heading mb-4">
                {feat.heading}
              </h2>
              <p className="text-[16px] leading-[1.3] text-text-muted max-w-[440px]">
                {feat.copy}
              </p>
            </div>

            {/* Visual */}
            <div className={i % 2 === 1 ? "md:[direction:ltr]" : ""}>
              {feat.visual}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
