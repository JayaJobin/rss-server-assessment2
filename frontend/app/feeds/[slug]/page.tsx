import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import RecordView from "@/components/RecordView";
import { getPostBySlug } from "@/lib/apiServer";
import styles from "./post.module.css";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post ? `${post.title} — RSS Server` : "Post not found" };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container">
      <RecordView slug={post.slug} />
      <Breadcrumbs />
      <article className={styles.article}>
        <p className="eyebrow">{post.category}</p>
        <h1>{post.title}</h1>
        <p className={styles.meta}>
          By {post.author} ·{" "}
          {new Date(post.date).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {post.readTime}
        </p>
        <p className={styles.body}>{post.body}</p>
        <Link href="/feeds" className={styles.back}>
          ← Back to all posts
        </Link>
      </article>
    </div>
  );
}
