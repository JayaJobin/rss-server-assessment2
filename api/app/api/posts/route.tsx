import { NextRequest, NextResponse } from 'next/server';
import { Post, FeedSource, Author } from '@/app/lib/sequelize';
import { incrementRequestCount } from '@/app/lib/requestCounter';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  incrementRequestCount();
  try {
    const id = request.nextUrl.searchParams.get('id');
    const slug = request.nextUrl.searchParams.get('slug');

    if (id) {
      const post = await Post.findByPk(parseInt(id), {
        include: [{ model: FeedSource, as: 'feedSource' }, { model: Author, as: 'authorProfile' }],
      });
      if (!post) return new NextResponse('Post not found', { status: 404, headers: corsHeaders });
      return NextResponse.json(post, { headers: corsHeaders });
    }

    if (slug) {
      const post = await Post.findOne({
        where: { slug },
        include: [{ model: FeedSource, as: 'feedSource' }, { model: Author, as: 'authorProfile' }],
      });
      if (!post) return new NextResponse('Post not found', { status: 404, headers: corsHeaders });
      return NextResponse.json(post, { headers: corsHeaders });
    }

    const posts = await Post.findAll({
      include: [{ model: FeedSource, as: 'feedSource' }, { model: Author, as: 'authorProfile' }],
    });
    return NextResponse.json(posts, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  incrementRequestCount();
  try {
    const { slug, title, author, publishedAt, category, summary, body, imageUrl, link, readTime, feedSourceId, authorId } = await request.json();
    if (!slug || !title || !author || !publishedAt || !category || !summary || !body) {
      return new NextResponse('Missing required fields', { status: 400, headers: corsHeaders });
    }
    const newPost = await Post.create({ slug, title, author, publishedAt, category, summary, body, imageUrl, link, readTime, feedSourceId, authorId });
    return NextResponse.json(newPost, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request body (slug must be unique)', { status: 400, headers: corsHeaders });
  }
}

export async function PATCH(request: NextRequest) {
  incrementRequestCount();
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return new NextResponse('Missing id', { status: 400, headers: corsHeaders });

    const post = await Post.findByPk(parseInt(id));
    if (!post) return new NextResponse('Post not found', { status: 404, headers: corsHeaders });

    const updates = await request.json();
    const fields = ['slug', 'title', 'author', 'publishedAt', 'category', 'summary', 'body', 'imageUrl', 'link', 'readTime', 'feedSourceId', 'authorId'] as const;
    for (const field of fields) {
      if (updates[field] !== undefined) post.set(field, updates[field]);
    }
    await post.save();
    return NextResponse.json(post, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest) {
  incrementRequestCount();
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return new NextResponse('Missing id', { status: 400, headers: corsHeaders });

    const post = await Post.findByPk(parseInt(id));
    if (!post) return new NextResponse('Post not found', { status: 404, headers: corsHeaders });

    await post.destroy();
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}
