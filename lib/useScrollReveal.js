"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal hook: applies `.revealed` class to `.reveal` children
 * when they reach 25% visibility. Each sibling staggers 80ms.
 * Respects prefers-reduced-motion.
 */
export function useScrollReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      // Instantly reveal everything
      const els = containerRef.current?.querySelectorAll(".reveal");
      els?.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Find sibling index for stagger
            const parent = el.parentElement;
            const siblings = parent
              ? Array.from(parent.querySelectorAll(":scope > .reveal"))
              : [];
            const index = siblings.indexOf(el);
            const delay = index >= 0 ? index * 80 : 0;

            setTimeout(() => {
              el.classList.add("revealed");
            }, delay);

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    const els = containerRef.current?.querySelectorAll(".reveal");
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return containerRef;
}
