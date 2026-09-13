import styles from "./WhyDifferent.module.css";

export default function WhyDifferent() {
  const comparisons = [
    {
      feature: "Matching Velocity",
      old: "Endless swiping roulette. 100+ superficial profiles daily to keep you glued.",
      matchmaker: "One intentional match at a time. Curated when genuine reciprocal alignment exists."
    },
    {
      feature: "Understanding Depth",
      old: "Superficial 5-photo resumes with generic bios and canned prompt answers.",
      matchmaker: "Deep psychometric synthesis covering communication style, core values, and life philosophy."
    },
    {
      feature: "Conversation Quality",
      old: "Awkward 'hey' messages, days of radio silence, and high ghosting rates.",
      matchmaker: "Bespoke conversation starters grounded in shared interests with concierge date handoff."
    },
    {
      feature: "Incentive Alignment",
      old: "Monetized on user loneliness with microtransactions and premium boost tiers.",
      matchmaker: "Incentivized solely to find your match and get you happily off our platform."
    }
  ];

  return (
    <section id="why-us" className={`section ${styles.whyDifferent}`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.sectionBadge}>THE PARADIGM SHIFT</span>
          <h2 className={styles.sectionTitle}>
            WHY WE'RE <span className="gradient-text">DIFFERENT</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Traditional dating apps are engineered for engagement loops. We are engineered for lasting partnership.
          </p>
        </div>

        <div className={styles.comparisonWrapper}>
          <div className={styles.columnHeaderRow}>
            <div className={styles.featureHeader}>Dimension</div>
            <div className={`${styles.columnHeader} ${styles.oldHeader}`}>
              <span className={styles.headerCross}>✕</span>
              <span>The Swipe Machine</span>
            </div>
            <div className={`${styles.columnHeader} ${styles.newHeader}`}>
              <span className={styles.headerCheck}>✓</span>
              <span>Matchmaker Concierge</span>
            </div>
          </div>

          <div className={styles.rowsList}>
            {comparisons.map((item, index) => (
              <div key={index} className={styles.comparisonRow}>
                <div className={styles.featureLabel}>
                  {item.feature}
                </div>
                <div className={`${styles.cell} ${styles.oldCell}`}>
                  <div className={styles.mobileColumnTitle}>Swipe Apps</div>
                  <p className={styles.oldText}>{item.old}</p>
                </div>
                <div className={`${styles.cell} ${styles.newCell}`}>
                  <div className={styles.mobileColumnTitle}>Matchmaker</div>
                  <p className={styles.newText}>{item.matchmaker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
