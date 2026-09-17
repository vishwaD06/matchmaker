"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

const SPARKLE_COLORS = ["#8a5a40", "#b08257", "#c5976b", "#1e1b18", "#d9b48f"];

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  const mousePos = useRef({ x: -100, y: -100 });
  const reticlePos = useRef({ x: -100, y: -100 });
  const lastParticlePos = useRef({ x: -100, y: -100 });

  const crossRef = useRef(null);
  const reticleRef = useRef(null);
  const rafId = useRef(null);

  useEffect(() => {
    // Only on pointer-fine desktop devices
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    setMounted(true);

    const onMouseMove = (e) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      // Instantly position center pixel cross
      if (crossRef.current) {
        crossRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // Spawn pixel wand dust sparkles if moved > 15px
      const dist = Math.hypot(
        e.clientX - lastParticlePos.current.x,
        e.clientY - lastParticlePos.current.y
      );

      if (dist > 16) {
        lastParticlePos.current = { x: e.clientX, y: e.clientY };

        const angle = Math.random() * Math.PI * 2;
        const speed = 10 + Math.random() * 16;
        const dx = `${Math.round(Math.cos(angle) * speed)}px`;
        const dy = `${Math.round(Math.sin(angle) * speed)}px`;
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        const id = Date.now() + Math.random();

        setParticles((prev) => [
          ...prev.slice(-12),
          { id, x: e.clientX, y: e.clientY, dx, dy, color },
        ]);

        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== id));
        }, 550);
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

    // Smooth Lerp loop for the outer reticle corners
    const render = () => {
      const lerp = 0.2;
      reticlePos.current.x += (mousePos.current.x - reticlePos.current.x) * lerp;
      reticlePos.current.y += (mousePos.current.y - reticlePos.current.y) * lerp;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${reticlePos.current.x}px, ${reticlePos.current.y}px, 0)`;
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
      {/* Outer Trailing Reticle Corners */}
      <div ref={reticleRef} className={styles.reticleRing}>
        <span className={`${styles.corner} ${styles.topLeft}`} />
        <span className={`${styles.corner} ${styles.topRight}`} />
        <span className={`${styles.corner} ${styles.bottomLeft}`} />
        <span className={`${styles.corner} ${styles.bottomRight}`} />
      </div>

      {/* Center Pixel Crosshair */}
      <div ref={crossRef} className={styles.pixelCross}>
        {isHovered ? (
          // Pixel diamond when target locked
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="2" width="2" height="2" fill="#8a5a40" />
            <rect x="4" y="4" width="2" height="2" fill="#8a5a40" />
            <rect x="8" y="4" width="2" height="2" fill="#8a5a40" />
            <rect x="2" y="6" width="2" height="2" fill="#8a5a40" />
            <rect x="10" y="6" width="2" height="2" fill="#8a5a40" />
            <rect x="6" y="6" width="2" height="2" fill="#1e1b18" />
            <rect x="4" y="8" width="2" height="2" fill="#8a5a40" />
            <rect x="8" y="8" width="2" height="2" fill="#8a5a40" />
            <rect x="6" y="10" width="2" height="2" fill="#8a5a40" />
          </svg>
        ) : (
          // Crisp 8-bit pixel cross +
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="1" width="2" height="4" fill="#1e1b18" />
            <rect x="6" y="9" width="2" height="4" fill="#1e1b18" />
            <rect x="1" y="6" width="4" height="2" fill="#1e1b18" />
            <rect x="9" y="6" width="4" height="2" fill="#1e1b18" />
            <rect x="6" y="6" width="2" height="2" fill="#8a5a40" />
          </svg>
        )}
      </div>

      {/* Retro Pixel Dust / Gaming Wand Sparkles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className={styles.pixelParticle}
          style={{
            transform: `translate3d(${p.x}px, ${p.y}px, 0)`,
            "--dx": p.dx,
            "--dy": p.dy,
            "--color": p.color,
          }}
        />
      ))}
    </div>
  );
}
