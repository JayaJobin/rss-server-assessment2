// FeedCard displays a single post preview with hide/show details
"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Post } from "@/types/post";
import styles from "./FeedCard.module.css";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function FeedCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const bodyId = useId();

  return (
    <article className={`card ${styles.card}`}>
      <div className={styles.meta}>
        <span className={styles.category}>{post.category}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </div>

      <h3 className={styles.title}>{post.title}</h3>
      <p className={styles.byline}>By {post.author}</p>
      <p className={styles.summary}>{post.summary}</p>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.readMore}
          aria-expanded={expanded}
          aria-controls={bodyId}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "Preview"}
          <span className={styles.chevron} aria-hidden="true">
            {expanded ? "▲" : "▼"}
          </span>
        </button>
        <Link href={`/feeds/${post.slug}`} className={styles.fullLink}>
          Open full post →
        </Link>
      </div>

      <div id={bodyId} className={styles.body} hidden={!expanded}>
        <p>{post.body}</p>
      </div>
    </article>
  );
}
