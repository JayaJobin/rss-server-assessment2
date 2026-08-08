/**
 * About Page
 * Explains the RSS Server project, confirms Assessment 1 is frontend-only,
 * and previews the Assessment 2 backend/RSS integration.
 * - Displays author name and student ID
 * - Embeds a short how-to-use walkthrough video
 * - FAQ section uses the reusable Accordion component
 */
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import Accordion from "@/components/Accordion";
import type { AccordionItem } from "@/components/Accordion";
import styles from "./about.module.css";

const FAQ_ITEMS: AccordionItem[] = [
  {
    title: "Why use sample blog content instead of a real RSS feed?",
    content: (
      <p>
        Assessment 1 is scoped to the frontend only. Sample posts give the
        interface real-shaped data to render — titles, dates, summaries,
        categories — without needing a working admin or sending pipeline
        yet. The shape is deliberately the same shape a post created here
        will use once it&apos;s sent as an RSS item in Assessment 2, so
        swapping in real authoring later shouldn&apos;t require
        restructuring any page.
      </p>
    ),
  },
  {
    title: "What changes in Assessment 2?",
    content: (
      <p>
        The RSS Server gains a working admin flow for creating and
        categorising posts, and starts sending them to subscribed RSS
        clients on a schedule through API routes. The Feeds, Home, and
        post pages built here should only need their data source swapped,
        not their layout.
      </p>
    ),
  },
  {
    title: "How are theme and layout preferences stored?",
    content: (
      <p>
        Theme, compact-layout, and last menu state are all saved to the
        browser&apos;s local storage the moment they change, and re-applied
        on the next visit — see the Settings page for a live view of what
        is currently stored.
      </p>
    ),
  },
];

export const metadata: Metadata = {
  title: "About — RSS Server",
};

export default function AboutPage() {
  return (
    <div className="container">
      <Breadcrumbs />
      <div className="page-header">
        <p className="eyebrow">About this project</p>
        <h1>What the RSS Server is, and what this stage covers</h1>
      </div>

      <div className={styles.layout}>
        <div>
          <p>
            The RSS Server is a small application where an admin creates
            posts, tags them with a category, and sends them out as RSS
            feed items. It is a server, not an aggregator: rather than
            collecting content from other sites, it is the source that
            other systems, such as the LMS, subscribe to and receive
            content from.
          </p>
          <p>
            <strong>Assessment 1 is frontend only.</strong> Every screen
            here — Home, Feeds, About, and Settings — is built with sample
            blog-style content standing in for posts an admin would
            author. No network request is made to a real RSS client yet,
            and no server code runs behind these pages. The goal at this
            stage is navigation, layout, theming, and accessibility.
          </p>
          <p>
            Assessment 2 introduces the server side properly: authoring and
            publishing posts, and sending them to subscribed RSS clients on
            a schedule, using the same post shape used throughout this
            interface. The client, such as the LMS, is intentionally simple
            on this end — just a frame that displays whatever the server
            sends it. Because the frontend was designed around that shape
            from the start, the pages built here should not need to change
            structure when live sending arrives, only their data source.
          </p>

          <h2 className={styles.subheading}>Author</h2>
          <dl className={styles.authorList}>
            <div>
              <dt>Name</dt>
              <dd>Jaya Jobin</dd>
            </div>
            <div>
              <dt>Student ID</dt>
              <dd>22839039</dd>
            </div>
            <div>
              <dt>Subject</dt>
              <dd>CSE5006 </dd>
            </div>
          </dl>
        </div>

        <aside className={`card ${styles.videoCard}`}>
          <h2 className={styles.videoTitle}>How to use this site</h2>
          <p className={styles.videoNote}>
            Short walkthrough of the navigation, theme toggle, and feed
            page. 
          </p>
          <video
              className={styles.video}
              controls
              preload="metadata"
              aria-label="How to use the RSS Server site"
          >
            <source src="/videos/how-to-use.mp4" type="video/mp4" />
            Your browser does not support embedded video. The walkthrough
            file is at /videos/how-to-use.mp4.
          </video>
        </aside>
      </div>

      <div className={styles.faqSection}>
        <h2 className={styles.subheading}>Frequently asked questions</h2>
        <Accordion items={FAQ_ITEMS} />
      </div>
    </div>
  );
}
