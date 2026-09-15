import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const stories = [
    {
      quote: "It felt like confiding in an emotionally perceptive friend who truly understood my quirks and love language, rather than filling out a shallow dating survey.",
      name: "Sarah & Marcus",
      location: "San Francisco, CA",
      timeframe: "Matched in Week 2",
      badge: "Now Engaged"
    },
    {
      quote: "The compatibility breakdown was uncanny. On our first coffee date, we immediately bypassed the exhausting small talk and spent three hours debating architecture and books.",
      name: "Julian & Priya",
      location: "New York, NY",
      timeframe: "Matched in Week 3",
      badge: "In a Relationship"
    },
    {
      quote: "I was completely burnt out from dating apps. Matchmaker gave me just one thoughtful introduction, and she is truly the most remarkable person I’ve ever met.",
      name: "David K.",
      location: "Austin, TX",
      timeframe: "Matched in Week 1",
      badge: "Together 8 Months"
    }
  ];

  return (
    <section id="stories" className={`section ${styles.testimonials}`}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.sectionBadge}>TESTIMONIALS</span>
          <h2 className={styles.sectionTitle}>
            REAL <span className="gradient-text">CONNECTIONS</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Stories from people who traded endless superficial swiping for deliberate, lasting love.
          </p>
        </div>

        <div className={styles.storiesGrid}>
          {stories.map((story, index) => (
            <div key={index} className={styles.storyCard}>
              <div className={styles.cardHeader}>
                <div className={styles.stars}>
                  {"★".repeat(5)}
                </div>
                <span className={styles.statusBadge}>{story.badge}</span>
              </div>

              <blockquote className={styles.quote}>
                "{story.quote}"
              </blockquote>

              <div className={styles.cardFooter}>
                <div className={styles.avatarGlow}>
                  <span>❤️</span>
                </div>
                <div>
                  <h4 className={styles.authorName}>{story.name}</h4>
                  <p className={styles.authorMeta}>
                    {story.location} • <span className={styles.timeframe}>{story.timeframe}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
