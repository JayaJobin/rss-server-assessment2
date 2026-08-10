"use client";

import { useEffect, useState } from "react";
import Breadcrumbs from "@/components/Breadcrumbs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://54.159.149.186:4000";

const CATEGORIES = ["All", "Announcements", "Demo"];

interface RssItem {
  title: string;
  link: string;
  description: string;
  author: string;
  category: string;
  pubDate: string;
}

function parseRssXml(xmlText: string): RssItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, "application/xml");
  const items = Array.from(doc.querySelectorAll("item"));

  return items.map((item) => ({
    title: item.querySelector("title")?.textContent ?? "",
    link: item.querySelector("link")?.textContent ?? "",
    description: item.querySelector("description")?.textContent ?? "",
    author: item.querySelector("author")?.textContent ?? "",
    category: item.querySelector("category")?.textContent ?? "",
    pubDate: item.querySelector("pubDate")?.textContent ?? "",
  }));
}

export default function RssClientPage() {
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState<RssItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawXml, setRawXml] = useState("");

  const feedUrl =
    category === "All"
      ? `${API_BASE}/api/rss`
      : `${API_BASE}/api/rss/${encodeURIComponent(category)}`;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchFeed() {
      try {
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error("Feed request failed");
        const xmlText = await res.text();
        if (cancelled) return;
        setRawXml(xmlText);
        setItems(parseRssXml(xmlText));
      } catch (err) {
        if (!cancelled) setError("Could not reach the RSS Server's feed endpoint.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFeed();
    return () => {
      cancelled = true;
    };
  }, [feedUrl]);

  return (
    <div className="container">
      <Breadcrumbs />
      <div className="page-header">
        <p className="eyebrow">RSS Client</p>
        <h1>Feed received from the RSS Server</h1>
        <p>
          This page acts as an RSS Client: it fetches{" "}
          <code>{feedUrl}</code> directly from the Assessment 2 backend
          and parses the raw RSS 2.0 XML in the browser, independent of the
          admin &quot;Feeds&quot; page. Switch category to hit the dynamic{" "}
          <code>/api/rss/[category]</code> endpoint instead of the full feed.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1rem" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="card"
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontWeight: c === category ? 700 : 400,
                border: c === category ? "2px solid currentColor" : undefined,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <p>Loading feed from server…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <>
          <p>Received {items.length} item(s) from the server.</p>
          <div style={{ display: "grid", gap: "1rem" }}>
            {items.map((item, index) => (
              <article key={index} className="card" style={{ padding: "1rem" }}>
                <p className="eyebrow">{item.category}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p>
                  By {item.author} · {new Date(item.pubDate).toLocaleDateString()}
                </p>
              </article>
            ))}
          </div>

          <details style={{ marginTop: "2rem" }}>
            <summary>View raw RSS XML received from the server</summary>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.85rem" }}>{rawXml}</pre>
          </details>
        </>
      )}
    </div>
  );
}