import type { FeedSource } from "@/types/feedSource";

// Sample sources this RSS server aggregates from. Stands in for real
// subscription data until Assessment 2's backend exists — the posts in
// data/posts.ts represent what these sources have already delivered.
export const defaultFeedSources: FeedSource[] = [
  { id: "src-1", name: "Campus Announcements", url: "https://example.edu/feeds/announcements.xml" },
  { id: "src-2", name: "Module 4 Blog", url: "https://example.edu/feeds/module-4.xml" },
];