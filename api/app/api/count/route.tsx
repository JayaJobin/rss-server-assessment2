import { NextResponse } from 'next/server';
import { getRequestCount, incrementRequestCount } from '@/app/lib/requestCounter';

export async function GET() {
  incrementRequestCount();
  return NextResponse.json({ count: getRequestCount() });
}
