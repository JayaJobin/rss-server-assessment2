import { NextRequest, NextResponse } from 'next/server';
import { postRepository } from '@/app/lib/repositories/postRepository';
import { incrementRequestCount } from '@/app/lib/requestCounter';
import { buildRssFeed } from '@/app/lib/rss';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  await incrementRequestCount();

  const { category } = await params;
  const posts = await postRepository.findByCategoryOrderedByCreatedAt(category);

  const xml = buildRssFeed(
    posts,
    `RSS Server Feed — ${category}`,
    `Live "${category}" feed generated from the Assessment 2 database`
  );

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
