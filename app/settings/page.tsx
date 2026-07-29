"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import Accordion from "@/components/Accordion";
import type { AccordionItem } from "@/components/Accordion";
import { useTheme } from "@/components/ThemeProvider";
import { useLayoutPreference } from "@/components/LayoutPreferenceProvider";
import { useLocalStorage } from "@/components/useLocalStorage";
import { useToast } from "@/components/ToastProvider";
import styles from "./settings.module.css";

const ADVANCED_ITEMS: AccordionItem[] = [
  {
    title: "Where are these preferences stored?",
    content: (
      <p>
        Theme, compact layout, and hamburger-menu state are written to
        <code> window.localStorage</code> as soon as they change, and read
        back on every page load via an inline script in the root layout,
        so there is no flash of the wrong setting before React hydrates.
      </p>
    ),
  },
  {
    title: "Reset all stored preferences",
    content: <ResetPreferences />,
  },
];

function ResetPreferences() {
  const { setLight } = useTheme();
  const { setCompact } = useLayoutPreference();
  const { showToast } = useToast();

  const handleReset = () => {
    setLight();
    setCompact(false);
    window.localStorage.removeItem("rss-server-menu-open");
    window.localStorage.removeItem("rss-server-recently-viewed");
    showToast("Preferences reset to defaults");
  };

  return (
    <div>
      <p>
        Clears the saved theme, layout, menu state, and recently viewed
        posts from this browser, and returns everything to its default.
      </p>
      <button type="button" className="btn btn-outline" onClick={handleReset}>
        Reset to defaults
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setLight, setDark } = useTheme();
  const { compact: compactLayout, setCompact: setCompactLayout } = useLayoutPreference();
  const [menuOpen] = useLocalStorage("rss-server-menu-open", false);
  const { showToast } = useToast();

  return (
    <div className="container">
      <Breadcrumbs />
      <div className="page-header">
        <p className="eyebrow">Preferences</p>
        <h1>Settings</h1>
        <p>
          These controls demonstrate how interface preferences are saved to
          local storage and re-applied on the next visit, without needing
          any backend.
        </p>
      </div>

      <section className={`card ${styles.panel}`} aria-labelledby="theme-heading">
        <h2 id="theme-heading">Theme</h2>
        <p className={styles.description}>
          Choose how the interface looks. Your choice is saved and used the
          next time you open the site.
        </p>
        <div className={styles.optionRow} role="radiogroup" aria-labelledby="theme-heading">
          <button
            type="button"
            className="btn btn-outline"
            role="radio"
            aria-checked={theme === "light"}
            onClick={() => {
              setLight();
              showToast("Theme set to light");
            }}
          >
            ☀️ Light
          </button>
          <button
            type="button"
            className="btn btn-outline"
            role="radio"
            aria-checked={theme === "dark"}
            onClick={() => {
              setDark();
              showToast("Theme set to dark");
            }}
          >
            🌙 Dark
          </button>
        </div>
      </section>

      <section className={`card ${styles.panel}`} aria-labelledby="layout-heading">
        <h2 id="layout-heading">Layout</h2>
        <p className={styles.description}>
          Narrow the main content column for a denser, compact reading
          layout across every page.
        </p>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={compactLayout}
            onChange={(event) => {
              setCompactLayout(event.target.checked);
              showToast(
                event.target.checked ? "Compact layout on" : "Compact layout off"
              );
            }}
          />
          Use compact layout
        </label>
      </section>

      <section className={`card ${styles.panel}`} aria-labelledby="status-heading">
        <h2 id="status-heading">Stored preferences</h2>
        <p className={styles.description}>
          Values currently held in your browser&apos;s local storage.
        </p>
        <dl className={styles.statusList}>
          <div>
            <dt>Theme</dt>
            <dd>{theme}</dd>
          </div>
          <div>
            <dt>Compact layout</dt>
            <dd>{compactLayout ? "On" : "Off"}</dd>
          </div>
          <div>
            <dt>Hamburger menu last left</dt>
            <dd>{menuOpen ? "Open" : "Closed"}</dd>
          </div>
        </dl>
      </section>

      <section className={`card ${styles.panel}`} aria-labelledby="advanced-heading">
        <h2 id="advanced-heading">Advanced</h2>
        <Accordion items={ADVANCED_ITEMS} />
      </section>
    </div>
  );
}
