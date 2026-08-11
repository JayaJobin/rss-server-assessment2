import type { Post } from "@/types/post";

const API_URL = process.env.API_INTERNAL_URL || "http://api:3000";

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

function mapPost(raw: RawPost): Post {
  return {
    slug: raw.slug,
    title: raw.title,
    date: raw.publishedAt,
    author: raw.author,
    category: raw.category,
    summary: raw.summary,
    body: raw.body,
    readTime: raw.readTime ?? "",
  };
}

export async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${API_URL}/api/posts`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map(mapPost);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`${API_URL}/api/posts?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.json();
    return mapPost(raw);
  } catch {
    return null;
  }
}
