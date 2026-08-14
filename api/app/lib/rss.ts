import { Post } from './models';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildItem(post: Post): string {
  const pubDate = new Date(post.publishedAt).toUTCString();
  const link = post.link || `https://example.com/feeds/${post.slug}`;
  return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="false">${escapeXml(post.slug)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(post.author)}</author>
      <category>${escapeXml(post.category)}</category>
      <description>${escapeXml(post.summary)}</description>
      ${post.imageUrl ? `<enclosure url="${escapeXml(post.imageUrl)}" type="image/jpeg" />` : ''}
    </item>`;
}

export function buildRssFeed(posts: Post[], title: string, description: string): string {
  const items = posts.map(buildItem).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>https://example.com</link>
    <description>${escapeXml(description)}</description>${items}
  </channel>
</rss>`;
}
