"use client";

import { useState } from "react";
import styles from "./WorkflowSteps.module.css";

interface Step {
  id: string;
  label: string;
  title: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    id: "create",
    label: "Create",
    title: "An admin creates a post on the server",
    detail:
      "This is a server, not an aggregator: an admin logs in and writes a post here, rather than the site collecting content from somewhere else. The Feeds page you can browse now shows exactly the kind of item that gets authored at this step.",
  },
  {
    id: "categorise",
    label: "Categorise",
    title: "The post is tagged with a category",
    detail:
      "Each item is filed under a category — the same categories used to filter the Feeds page — so clients can later request or display only what's relevant to them.",
  },
  {
    id: "publish",
    label: "Publish",
    title: "The item is queued on the RSS Server",
    detail:
      "In Assessment 2, publishing a post will make it available on the server as a proper RSS feed item, ready to be delivered rather than just stored.",
  },
  {
    id: "send",
    label: "Send",
    title: "The RSS Server sends it to clients",
    detail:
      "The server pushes each feed out to subscribed RSS clients, such as the LMS. The client itself is just a frame that receives and displays what the server sends — it doesn't fetch or aggregate anything on its own.",
  },
];

export default function WorkflowSteps() {
  const [activeId, setActiveId] = useState(STEPS[0].id);
  const active = STEPS.find((step) => step.id === activeId) ?? STEPS[0];

  return (
    <div className={styles.wrapper}>
      <ol className={styles.rail}>
        {STEPS.map((step, index) => {
          const isActive = step.id === activeId;
          return (
            <li key={step.id} className={styles.railItem}>
              <button
                type="button"
                className={`${styles.node} ${isActive ? styles.nodeActive : ""}`}
                onClick={() => setActiveId(step.id)}
                aria-pressed={isActive}
              >
                <span className={styles.nodeIndex}>{index + 1}</span>
                <span className={styles.nodeLabel}>{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <span className={styles.connector} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>

      <div className={styles.detail} role="region" aria-live="polite">
        <p className="eyebrow">Step {STEPS.indexOf(active) + 1} of {STEPS.length}</p>
        <h3>{active.title}</h3>
        <p>{active.detail}</p>
      </div>
    </div>
  );
}
