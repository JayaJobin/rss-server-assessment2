import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "80px 0", textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1>That post left the feed</h1>
      <p>The page you were looking for does not exist.</p>
      <Link href="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
}
