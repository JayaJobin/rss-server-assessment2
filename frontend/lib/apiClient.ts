"use client";

import type { FeedSource } from "@/types/feedSource";
import type { Post } from "@/types/post";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RawFeedSource {
  id: number | string;
  name: string;
  url: string;
}

export async function getFeedSources(): Promise<FeedSource[]> {
  const res = await fetch(`${API_URL}/api/feedsources`);
  if (!res.ok) throw new Error("Failed to fetch feed sources");
  const data: RawFeedSource[] = await res.json();
  return data.map((s) => ({ id: String(s.id), name: s.name, url: s.url }));
}

export async function addFeedSource(name: string, url: string): Promise<FeedSource> {
  const res = await fetch(`${API_URL}/api/feedsources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, url }),
  });
  if (!res.ok) throw new Error("Failed to add feed source");
  const s = await res.json();
  return { id: String(s.id), name: s.name, url: s.url };
}

export async function deleteFeedSource(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/feedsources?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete feed source");
}

interface RawPost {
  slug: string;
  title: string;
  publishedAt: string;
  author: string;
  category: string;
  summary: string;
  body: string;
  readTime?: string;
}

export async function getPostsClient(): Promise<Post[]> {
  const res = await fetch(`${API_URL}/api/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  const data: RawPost[] = await res.json();
  return data.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.publishedAt,
    author: p.author,
    category: p.category,
    summary: p.summary,
    body: p.body,
    readTime: p.readTime ?? "",
  }));
}

export async function addPost(input: {
  slug: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  body: string;
}) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      publishedAt: new Date().toISOString().slice(0, 10),
      readTime: "1 min read",
    }),
  });
  if (!res.ok) throw new Error("Failed to add post");
  return res.json();
}

export async function deletePostBySlug(id: number) {
  const res = await fetch(`${API_URL}/api/posts?id=${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
}
