import Button from "../ui/Button";
import styles from "./CTA.module.css";

export default function CTA() {
  return (
    <section className={`section ${styles.ctaSection}`}>
      <div className={`container ${styles.container}`}>
        <div className={styles.ctaBox}>
          {/* Internal ambient glow */}
          <div className={styles.glowOrb}></div>

          <div className={styles.content}>
            <span className={styles.badge}>INTENTIONAL DATING STARTS HERE</span>

            <h2 className={styles.title}>
              YOUR PERSON <br />
              <span className="gradient-text">IS WAITING.</span>
            </h2>

            <p className={styles.subtitle}>
              Step off the superficial swipe treadmill. Spend 5 relaxed minutes in conversation with our AI concierge and let us discover who you truly align with.
            </p>

            <div className={styles.buttonWrapper}>
              <Button href="/onboarding" variant="primary" className={styles.actionBtn}>
                Ready for some crazy convo...
                <span className={styles.btnArrow}>→</span>
              </Button>
            </div>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>Chillax its Confidential</span>
              <span className={styles.trustDivider}>•</span>
              <span className={styles.trustItem}> No Public Browsing</span>
              <span className={styles.trustDivider}>•</span>
              <span className={styles.trustItem}> One Match at a Time</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
