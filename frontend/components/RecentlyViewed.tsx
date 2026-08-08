"use client";

import Link from "next/link";
import type { Post } from "@/types/post";
import { useRecentlyViewedSlugs } from "./useRecentlyViewed";
import styles from "./RecentlyViewed.module.css";

// Reusable sidebar widget: reads the visitor's recently viewed posts
// from localStorage and renders them as quick links. Dropped into both
// the Home page and the Feeds page, so the same reusable content area
// appears in two different layouts without duplicating logic.
export default function RecentlyViewed({ posts }: { posts: Post[] }) {
  const slugs = useRecentlyViewedSlugs();
  const items = slugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is Post => Boolean(post));

  if (items.length === 0) {
    return (
      <aside className={`card ${styles.panel}`} aria-labelledby="recently-viewed-heading">
        <h2 id="recently-viewed-heading" className={styles.heading}>
          Recently viewed
        </h2>
        <p className={styles.empty}>
          Posts you open will show up here for quick access next time.
        </p>
      </aside>
    );
  }

  return (
    <aside className={`card ${styles.panel}`} aria-labelledby="recently-viewed-heading">
      <h2 id="recently-viewed-heading" className={styles.heading}>
        Recently viewed
      </h2>
      <ul className={styles.list} role="list">
        {items.map((post) => (
          <li key={post.slug}>
            <Link href={`/feeds/${post.slug}`} className={styles.link}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
