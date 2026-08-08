import { NextRequest, NextResponse } from 'next/server';
import { FeedSource } from '@/app/lib/sequelize';
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
    if (id) {
      const source = await FeedSource.findByPk(parseInt(id));
      if (!source) return new NextResponse('FeedSource not found', { status: 404, headers: corsHeaders });
      return NextResponse.json(source, { headers: corsHeaders });
    }
    const sources = await FeedSource.findAll();
    return NextResponse.json(sources, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  incrementRequestCount();
  try {
    const { name, url } = await request.json();
    if (!name || !url) {
      return new NextResponse('Missing name or url', { status: 400, headers: corsHeaders });
    }
    const newSource = await FeedSource.create({ name, url });
    return NextResponse.json(newSource, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}

export async function PATCH(request: NextRequest) {
  incrementRequestCount();
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) return new NextResponse('Missing id', { status: 400, headers: corsHeaders });

    const source = await FeedSource.findByPk(parseInt(id));
    if (!source) return new NextResponse('FeedSource not found', { status: 404, headers: corsHeaders });

    const { name, url } = await request.json();
    if (name !== undefined) source.name = name;
    if (url !== undefined) source.url = url;
    await source.save();
    return NextResponse.json(source, { headers: corsHeaders });
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

    const source = await FeedSource.findByPk(parseInt(id));
    if (!source) return new NextResponse('FeedSource not found', { status: 404, headers: corsHeaders });

    await source.destroy();
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}
