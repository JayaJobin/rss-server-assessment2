import { NextResponse } from 'next/server';
import { FeedSource, Post } from '@/app/lib/sequelize';
import { getRequestCount } from '@/app/lib/requestCounter';

export async function GET() {
  try {
    const [totalFeedSources, totalPosts] = await Promise.all([
      FeedSource.count(),
      Post.count(),
    ]);

    return NextResponse.json({
      totalFeedSources,
      totalPosts,
      totalApiRequests: getRequestCount(),
    });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500 });
  }
}
