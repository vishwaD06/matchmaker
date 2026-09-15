import Link from "next/link";
import styles from "./Button.module.css";

export default function Button({ 
  children, 
  variant = "primary", 
  href, 
  onClick, 
  className = "",
  disabled = false,
  type = "button"
}) {
  const baseClass = `${styles.btn} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClass} disabled={disabled}>
      {children}
    </button>
  );
}
