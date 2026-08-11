import { NextResponse } from 'next/server';
import { Post } from '@/app/lib/sequelize';
import { incrementRequestCount } from '@/app/lib/requestCounter';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET() {
  incrementRequestCount();
  const posts = await Post.findAll({ order: [['createdAt', 'DESC']] });

  const items = posts
    .map((post) => {
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
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>RSS Server Feed</title>
    <link>https://example.com</link>
    <description>Live feed generated from the Assessment 2 database</description>${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
