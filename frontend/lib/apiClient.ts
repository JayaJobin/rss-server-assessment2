"use client";

import type { FeedSource } from "@/types/feedSource";

const API_URL = "http://52.207.252.243:4000";

export async function getFeedSources(): Promise<FeedSource[]> {
  const res = await fetch(`${API_URL}/api/feedsources`);
  if (!res.ok) throw new Error("Failed to fetch feed sources");
  const data = await res.json();
  return data.map((s: any) => ({ id: String(s.id), name: s.name, url: s.url }));
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
