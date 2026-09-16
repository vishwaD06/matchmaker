import styles from "./ProfileCard.module.css";
import TraitRadar from "./TraitRadar";

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className={`glass-card ${styles.card}`}>
      <div className={styles.header}>
        {profile.selfie ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={profile.selfie} alt={profile.name} className={styles.avatar} style={{ objectFit: "cover" }} />
        ) : (
          <div className={styles.avatar}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
          </div>
        )}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 className="heading-sm mb-1">{profile.name}{profile.age ? `, ${profile.age}` : ""}</h2>
            {profile.isVerified && (
              <span title="Verified Identity" style={{ color: "#10b981", fontSize: "1.1rem", display: "inline-flex" }}>
                ✓
              </span>
            )}
          </div>
          <p className="text-accent text-sm uppercase tracking-wide">
            {profile.location ? `${profile.location} · ` : ""}Compatibility Profile
          </p>
          {profile.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "0.8rem", color: "var(--accent-secondary)", textDecoration: "underline", display: "inline-block", marginTop: "2px" }}
            >
              Verified LinkedIn Profile ↗
            </a>
          )}
        </div>
      </div>

      {profile.photos && profile.photos.length > 0 && (
        <div style={{ marginBottom: "var(--space-8)" }}>
          <h3 className={styles.sectionTitle}>Uploaded Photos ({profile.photos.length})</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.6rem" }}>
            {profile.photos.map((photo, i) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={i}
                src={photo}
                alt={`Photo ${i + 1}`}
                style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--border-subtle)" }}
              />
            ))}
          </div>
        </div>
      )}

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
