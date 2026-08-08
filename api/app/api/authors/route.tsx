import { NextRequest, NextResponse } from 'next/server';
import { Author, Post } from '@/app/lib/sequelize';
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
      const author = await Author.findByPk(parseInt(id), {
        include: [{ model: Post, as: 'posts' }],
      });
      if (!author) return new NextResponse('Author not found', { status: 404, headers: corsHeaders });
      return NextResponse.json(author, { headers: corsHeaders });
    }
    const authors = await Author.findAll({ include: [{ model: Post, as: 'posts' }] });
    return NextResponse.json(authors, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  incrementRequestCount();
  try {
    const { name, email } = await request.json();
    if (!name) return new NextResponse('Missing name', { status: 400, headers: corsHeaders });
    const newAuthor = await Author.create({ name, email });
    return NextResponse.json(newAuthor, { status: 201, headers: corsHeaders });
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

    const author = await Author.findByPk(parseInt(id));
    if (!author) return new NextResponse('Author not found', { status: 404, headers: corsHeaders });

    const { name, email } = await request.json();
    if (name !== undefined) author.name = name;
    if (email !== undefined) author.email = email;
    await author.save();
    return NextResponse.json(author, { headers: corsHeaders });
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

    const author = await Author.findByPk(parseInt(id));
    if (!author) return new NextResponse('Author not found', { status: 404, headers: corsHeaders });

    await author.destroy();
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}
