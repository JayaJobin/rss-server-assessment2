"use client";

import { ReactNode, useId, useState } from "react";
import styles from "./Accordion.module.css";

export interface AccordionItem {
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIndex?: number | null;
}

// Generic, reusable hide/show content area. Any page can pass a list of
// { title, content } items and get an accessible accordion for free —
// used on the About page (FAQ) and the Settings page (Advanced options)
// so the same component demonstrably serves two different content areas.
export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIndex = null,
}: AccordionProps) {
  const baseId = useId();
  const [openIndexes, setOpenIndexes] = useState<number[]>(
    defaultOpenIndex === null ? [] : [defaultOpenIndex]
  );

  const isOpen = (index: number) => openIndexes.includes(index);

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const currentlyOpen = prev.includes(index);
      if (allowMultiple) {
        return currentlyOpen ? prev.filter((i) => i !== index) : [...prev, index];
      }
      return currentlyOpen ? [] : [index];
    });
  };

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => {
        const open = isOpen(index);
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div key={item.title} className={styles.item}>
            <h3 className={styles.heading}>
              <button
                id={buttonId}
                type="button"
                className={styles.trigger}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
              >
                <span>{item.title}</span>
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`} aria-hidden="true">
                  ▾
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
              hidden={!open}
            >
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
