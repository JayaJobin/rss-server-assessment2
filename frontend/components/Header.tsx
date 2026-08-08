import Navbar from "./Navbar";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`${styles.titleBar} container`}>
        <p className={styles.assessmentTitle}>
          Frontend Design and Usability (React)
        </p>
      </div>
      <Navbar />
    </header>
  );
}
