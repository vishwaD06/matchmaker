import styles from "./ProgressBar.module.css";

const PHASES = [
  { id: "intro", label: "Intro" },
  { id: "values", label: "Values" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "relationships", label: "Relationships" },
  { id: "communication", label: "Communication" },
  { id: "wrapup", label: "Wrap-up" }
];

export default function ProgressBar({ currentPhase }) {
  const currentIndex = PHASES.findIndex(p => p.id === currentPhase);
  const progressPercent = Math.max(5, ((currentIndex + 1) / PHASES.length) * 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.label}>
          {PHASES[currentIndex]?.label || "Interview"}
        </span>
        <span className={styles.percent}>{Math.round(progressPercent)}%</span>
      </div>
      <div className={styles.track}>
        <div 
          className={styles.fill} 
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
