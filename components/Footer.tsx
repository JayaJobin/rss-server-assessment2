import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} container`}>
        <div>
        <p className={styles.name}>Jaya Jobin, Student ID: 22839039</p>
        </div>
        <p className={styles.meta}>
          RSS Server &amp; LMS frontend ·  &copy; {year}
        </p>
      </div>
    </footer>
  );
}
