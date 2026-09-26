"use client";

import { useScrollReveal } from "@/lib/useScrollReveal";

export default function ProductProof() {
  const ref = useScrollReveal();

  return (
    <section
      ref={ref}
      id="product"
      className="py-24 md:py-[140px] px-6"
      aria-label="Product demonstration"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Eyebrow */}
        <p className="reveal text-[12px] uppercase tracking-[0.08em] text-text-muted mb-4 font-body">
          The Arcline Platform
        </p>

        {/* Section heading */}
        <h2 className="reveal font-heading font-[400] text-[32px] md:text-[48px] leading-[1] tracking-[-2px] text-text-heading max-w-[640px] mb-12 md:mb-16">
          One interface for every evaluation.
        </h2>

        {/* Terminal / Product mock */}
        <div className="reveal relative">
          <div className="border border-border rounded-lg overflow-hidden bg-[#1a1a18]">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(255,255,255,0.08)]">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-4 text-[12px] text-[rgba(255,255,255,0.4)] font-body">
                arcline eval — model_v3.2
              </span>
            </div>

            {/* Terminal content */}
            <div className="p-6 md:p-8 font-mono text-[13px] md:text-[14px] leading-[1.7] text-[rgba(255,255,255,0.7)]">
              <p className="text-[rgba(255,255,255,0.4)]">
                <span className="text-accent">$</span> arcline eval run --model gpt-5-preview --suite alignment-v4
              </p>
              <p className="mt-4 text-[rgba(255,255,255,0.3)]">
                ───────────────────────────────────────────
              </p>
              <p className="mt-2">
                <span className="text-[#28c840]">✓</span> Factuality benchmark
                <span className="text-[rgba(255,255,255,0.4)] ml-4">
                  97.2% — 14,200 samples
                </span>
              </p>
              <p className="mt-1">
                <span className="text-[#28c840]">✓</span> Instruction adherence
                <span className="text-[rgba(255,255,255,0.4)] ml-4">
                  94.8% — 8,400 samples
                </span>
              </p>
              <p className="mt-1">
                <span className="text-[#febc2e]">⚠</span> Safety regression detected
                <span className="text-[rgba(255,255,255,0.4)] ml-4">
                  −2.1% vs baseline
                </span>
              </p>
              <p className="mt-1">
                <span className="text-[#28c840]">✓</span> Creative reasoning
                <span className="text-[rgba(255,255,255,0.4)] ml-4">
                  91.6% — 6,800 samples
                </span>
              </p>
              <p className="mt-4 text-[rgba(255,255,255,0.3)]">
                ───────────────────────────────────────────
              </p>
              <p className="mt-2">
                <span className="text-white">Report:</span> 4 suites · 29,400 samples · 3m 42s
              </p>
              <p className="mt-1 text-accent">
                → 1 regression flagged. View full report ↗
              </p>
            </div>
          </div>

          {/* Floating annotation labels */}
          <div className="hidden md:flex absolute -right-4 top-[120px] translate-x-full items-start gap-3">
            <div className="w-8 border-t border-text-muted mt-2" />
            <div>
              <p className="text-[12px] uppercase tracking-[0.08em] text-text-muted font-body">
                Automated regression alerts
              </p>
              <p className="text-[13px] text-text mt-1 max-w-[200px]">
                Flags safety and quality regressions before deployment.
              </p>
            </div>
          </div>

          <div className="hidden md:flex absolute -right-4 top-[240px] translate-x-full items-start gap-3">
            <div className="w-8 border-t border-text-muted mt-2" />
            <div>
              <p className="text-[12px] uppercase tracking-[0.08em] text-text-muted font-body">
                Human-calibrated scoring
              </p>
              <p className="text-[13px] text-text mt-1 max-w-[200px]">
                Every metric anchored to verified expert judgments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
