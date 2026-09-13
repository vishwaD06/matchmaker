import Link from "next/link";
import Button from "../ui/Button";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      {/* Ambient background glows */}
      <div className="bg-glow">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className={`container ${styles.container}`}>
        {/* Main Hero Header */}
        <div className={styles.content}>
          <div className={`${styles.badge} animate-slide-up`}>
            <span className={styles.badgeDot}></span>
            <span>AI-POWERED INTENTIONAL DATING</span>
          </div>

          <h1 className={`${styles.headline} animate-slide-up delay-1`}>
            <span className={styles.displayLine}>STOP SWIPING.</span>
            <span className={`${styles.displayLine} gradient-text`}>START CONNECTING.</span>
          </h1>

          <p className={`${styles.subtitle} animate-slide-up delay-2`}>
            Say goodbye to fatigue, ghosting, and superficial swipe decks.
            Our AI concierge gets to know the real you through a meaningful conversation,
            delivering high-intent, values-aligned introductions.
          </p>

          <div className={`${styles.ctaGroup} animate-slide-up delay-3`}>
            <Button href="/onboarding" variant="primary" className={styles.primaryCta}>
              Begin Your Story
              <span className={styles.arrowIcon}>→</span>
            </Button>
            <Button href="#how-it-works" variant="secondary" className={styles.secondaryCta}>
              See How It Works
            </Button>
          </div>

          {/* Key metrics / trust indicators */}
          <div className={`${styles.metricsRow} animate-slide-up delay-4`}>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>1</span>
              <span className={styles.metricLabel}>Curated Match at a Time</span>
            </div>
            <div className={styles.metricDivider}></div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>94%</span>
              <span className={styles.metricLabel}>Second-Date Alignment</span>
            </div>
            <div className={styles.metricDivider}></div>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>0</span>
              <span className={styles.metricLabel}>Superficial Swiping</span>
            </div>
          </div>
        </div>

        {/* Floating Interactive Match Preview Card */}
        <div className={`${styles.previewWrapper} animate-slide-up delay-3`}>
          <div className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div className={styles.previewStatus}>
                <span className={styles.liveIndicator}></span>
                <span>AI MATCH FOUND • 96% RESONANCE</span>
              </div>
              <span className={styles.previewTag}>Mutual Core Values</span>
            </div>

            <div className={styles.previewBody}>
              <div className={styles.matchAvatarSection}>
                <div className={styles.avatarOrb}>
                  <span>✨</span>
                </div>
                <div>
                  <h4 className={styles.matchName}>Julian, 29</h4>
                  <p className={styles.matchMeta}>Architect & Trail Runner • Brooklyn, NY</p>
                </div>
              </div>

              <div className={styles.aiInsightBox}>
                <div className={styles.aiInsightLabel}>
                  <span className={styles.sparkle}>✦</span> Why You Match
                </div>
                <p className={styles.aiInsightText}>
                  "Both of you share an obsession with quiet Sunday mornings, intentional creative work, and spontaneous culinary experiments. Julian values honest vulnerability above all else."
                </p>
              </div>

              <div className={styles.tagList}>
                <span className={styles.tag}>Philosophy & Design</span>
                <span className={styles.tag}>Early Riser</span>
                <span className={styles.tag}>Growth Mindset</span>
              </div>

              <div className={styles.starterBox}>
                <span className={styles.starterLabel}>Curated Icebreaker:</span>
                <p className={styles.starterText}>
                  "Ask Julian about the hand-built cabin in upstate NY he spent last autumn sketching."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
