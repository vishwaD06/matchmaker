"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import Button from "./Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Matchmaker
        </Link>

        <div
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <Link
            href="/#how-it-works"
            className={styles.link}
            onClick={() => setMenuOpen(false)}
          >
            Process
          </Link>
          <Link
            href="/#why-us"
            className={styles.link}
            onClick={() => setMenuOpen(false)}
          >
            Why Us
          </Link>
          <Link
            href="/#stories"
            className={styles.link}
            onClick={() => setMenuOpen(false)}
          >
            Stories
          </Link>
          <Button href="/onboarding" variant="primary">
            Begin
          </Button>
        </div>
      </div>
    </nav>
  );
}
