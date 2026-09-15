import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContent}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            MATCHMAKER
          </Link>
          <p className={styles.tagline}>
            AI-powered intentional dating concierge. Engineered for genuine human connection, not slot-machine engagement.
          </p>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot}></span>
            <span>All Systems Operational • Matches Active</span>
          </div>
        </div>

        <div className={styles.linksGrid}>
          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Navigation</h4>
            <Link href="#how-it-works" className={styles.link}>The Process</Link>
            <Link href="#why-us" className={styles.link}>Why We're Different</Link>
            <Link href="#stories" className={styles.link}>Match Stories</Link>
            <Link href="/onboarding" className={styles.link}>Begin Interview</Link>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Philosophy</h4>
            <span className={styles.linkStatic}>Values-First Vector Matching</span>
            <span className={styles.linkStatic}>Zero Swiping Policy</span>
            <span className={styles.linkStatic}>No Public Profiles</span>
            <span className={styles.linkStatic}>Reciprocal Introductions</span>
          </div>

          <div className={styles.linkCol}>
            <h4 className={styles.colTitle}>Legal & Safety</h4>
            <Link href="#" className={styles.link}>Privacy Charter</Link>
            <Link href="#" className={styles.link}>Terms of Concierge</Link>
            <Link href="#" className={styles.link}>Security & Encryption</Link>
            <Link href="#" className={styles.link}>Contact Concierge</Link>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Matchmaker Inc. Crafting deliberate love stories.
        </p>
        <p className={styles.madeWith}>
          Designed with intention &amp; care.
        </p>
      </div>
    </footer>
  );
}
