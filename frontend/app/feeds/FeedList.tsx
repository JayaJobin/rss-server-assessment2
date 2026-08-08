"use client";

import { useMemo, useState } from "react";
import FeedCard from "@/components/FeedCard";
import type { Post } from "@/types/post";
import styles from "./feeds.module.css";

export default function FeedList({ posts }: { posts: Post[] }) {
  const categories = useMemo(
    () => ["All", ...new Set(posts.map((post) => post.category))],
    [posts]
  );
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const byCategory =
    active === "All" ? posts : posts.filter((post) => post.category === active);

  const visible = query.trim()
    ? byCategory.filter((post) =>
        `${post.title} ${post.summary}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : byCategory;

  return (
    <>
      <div className={styles.filterRow} role="group" aria-label="Filter posts by category">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="btn btn-outline"
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {active === category && <span aria-hidden="true">✓ </span>}
            {category}
          </button>
        ))}
      </div>

      <label className={styles.searchRow} htmlFor="feed-search">
        <span className={styles.searchLabel}>Search posts</span>
        <input
          id="feed-search"
          type="search"
          className={styles.searchInput}
          placeholder="Search by title or summary…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <p className={styles.count} aria-live="polite">
        Showing {visible.length} of {posts.length} posts
      </p>

      {visible.length === 0 ? (
        <p className={styles.emptyState}>
          No posts match &ldquo;{query}&rdquo;. Try a different search term or category.
        </p>
      ) : (
        <div className={styles.grid}>
          {visible.map((post) => (
            <FeedCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
