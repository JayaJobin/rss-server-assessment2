import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import RecentlyViewed from "@/components/RecentlyViewed";
import ManageFeeds from "@/components/ManageFeeds";
import FeedList from "./FeedList";
import { posts } from "@/data/posts";

export const metadata: Metadata = {
  title: "Feeds — RSS Server",
};

export default function FeedsPage() {
  return (
    <div className="container">
      <Breadcrumbs />
      <div className="page-header">
        <p className="eyebrow">Sample content</p>
        <h1>Posts published on this server</h1>
        <p>
          This list is static sample data standing in for Module 4&apos;s
          blog content, representing the posts an admin has created and
          categorised on this server, ready to be sent to RSS clients in
          Assessment 2. Filter by category, expand a card for a preview, or
          open a post for the full write-up.
        </p>
      </div>
      <ManageFeeds />
      <RecentlyViewed posts={posts} />
      <FeedList posts={posts} />
    </div>
  );
}
