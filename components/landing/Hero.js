import Button from "../ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Ambient background glows */}
      <div className="bg-glow">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>


      <div className={`container ${styles.container}`}>
        <h1 className={`${styles.headline} animate-slide-up`}>
          <span className={styles.displayLine}>STOP SWIPING.</span>
          <span className={`${styles.displayLine} gradient-text`}>START CONNECTING.</span>
        </h1>

        <p className={`${styles.subtitle} animate-slide-up delay-1`}>
          One introduction at a time.
        </p>

        <Button
          href="/onboarding"
          variant="primary"
          className={`${styles.primaryCta} animate-slide-up delay-2`}
        >
          Begin
          <svg className={styles.arrowIcon} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>

      <p className={styles.footnote}>&copy; {new Date().getFullYear()} Matchmaker</p>
    </section>
  );
}
