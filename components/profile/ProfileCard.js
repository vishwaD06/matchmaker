import styles from "./ProfileCard.module.css";
import TraitRadar from "./TraitRadar";

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div>
          <h2 className="heading-sm mb-1">{profile.name}</h2>
          <p className="text-accent text-sm uppercase tracking-wide">Compatibility Profile</p>
        </div>
      </div>

      <div className={styles.bio}>
        <p className="text-lg">{profile.bio}</p>
      </div>

      <div className={styles.radarSection}>
        <h3 className={styles.sectionTitle}>Personality Matrix</h3>
        <TraitRadar traits={profile.traits} />
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Core Values</h3>
          <ul className={styles.tagList}>
            {profile.values?.map((val, i) => (
              <li key={i} className={styles.tag}>{val}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Lifestyle</h3>
          <ul className={styles.tagList}>
            {profile.lifestyle?.map((val, i) => (
              <li key={i} className={styles.tag}>{val}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Relationship Style</h3>
        <p className="text-secondary">{profile.relationship_style}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Communication Style</h3>
        <p className="text-secondary">{profile.communication_style}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Looking For</h3>
        <p className="text-secondary">{profile.looking_for}</p>
      </div>
      
      {profile.deal_breakers && profile.deal_breakers.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Deal-Breakers</h3>
          <ul className={styles.tagList}>
            {profile.deal_breakers.map((val, i) => (
              <li key={i} className={`${styles.tag} ${styles.negativeTag}`}>{val}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
