"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  // Direct coordinate refs for high 60-120fps performance without React render lags
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const lastParticlePos = useRef({ x: -100, y: -100 });
  
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const spotlightRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setMounted(true);

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instantly position the center dot & spotlight
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Sparkle particle trail: spawn when moved > 16px
      const dist = Math.hypot(
        e.clientX - lastParticlePos.current.x,
        e.clientY - lastParticlePos.current.y
      );

      if (dist > 18) {
        lastParticlePos.current = { x: e.clientX, y: e.clientY };

        const angle = Math.random() * Math.PI * 2;
        const speed = 12 + Math.random() * 20;
        const dx = `${Math.cos(angle) * speed}px`;
        const dy = `${Math.sin(angle) * speed}px`;
        const id = Date.now() + Math.random();

        setParticles((prev) => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY, dx, dy }]);

        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 650);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target.closest &&
        target.closest("a, button, [role='button'], input, select, textarea, label, [data-interactive]")
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth Lerp loop for trailing ring
    const render = () => {
      const lerp = 0.16;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerp;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerp;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  if (!mounted) return null;

  return (
    <div
      className={`${styles.cursorWrapper} ${isHovered ? styles.hovered : ""} ${
        isClicked ? styles.clicked : ""
      }`}
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* Ambient background flashlight / spotlight */}
      <div ref={spotlightRef} className={styles.cursorSpotlight} />

      {/* Outer smooth-trailing ring */}
      <div ref={ringRef} className={styles.cursorRing} />

      {/* Precise center dot */}
      <div ref={dotRef} className={styles.cursorDot} />

      {/* Sparkle particle trail */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.sparkleParticle}
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
            "--dx": p.dx,
            "--dy": p.dy,
          }}
        />
      ))}
    </div>
  );
}
