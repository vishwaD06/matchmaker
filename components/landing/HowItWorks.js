import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "The Conversational Interview",
      subtitle: "No rigid check-boxes",
      description: "Chat naturally with our empathetic AI concierge. Through a relaxed, flowing dialogue, we discover your true sense of humor, communication nuances, and relationship goals.",
      highlight: "5-10 min voice or text chat",
      icon: "💬"
    },
    {
      num: "02",
      title: "Psychological Synthesis",
      subtitle: "Beyond superficial photos",
      description: "Our matching engine translates your life values, emotional attachment style, and non-negotiables into a high-dimensional compatibility model.",
      highlight: "Values-first vector mapping",
      icon: "⚡"
    },
    {
      num: "03",
      title: "Bespoke Introduction",
      subtitle: "One match at a time",
      description: "When reciprocal resonance is discovered, both parties receive a curated dossier detailing why you align, complete with custom conversation starters for a seamless first date.",
      highlight: "Zero swiping, zero ghosting",
      icon: "✨"
    }
  ];

  return (
    <section id="how-it-works" className={`section ${styles.howItWorks}`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.sectionBadge}>THE PROCESS</span>
          <h2 className={styles.sectionTitle}>
            HOW IT <span className="gradient-text">WORKS</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A calm, intentional alternative to the superficial noise of swipe culture.
          </p>
        </div>

        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <div className={styles.cardTop}>
                <span className={styles.stepNumber}>{step.num}</span>
                <span className={styles.stepIcon}>{step.icon}</span>
              </div>
              <div className={styles.cardContent}>
                <span className={styles.cardSubtitle}>{step.subtitle}</span>
                <h3 className={styles.cardTitle}>{step.title}</h3>
                <p className={styles.cardDescription}>{step.description}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.highlightBadge}>
                  <span className={styles.highlightDot}></span>
                  {step.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
