import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { corsHeaders } from './cors';

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: corsHeaders });
}

export function zodErrorResponse(error: ZodError) {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '(root)';
    fields[key] = issue.message;
  }
  return NextResponse.json(
    { error: 'Validation failed', fields },
    { status: 400, headers: corsHeaders }
  );
}

export async function withErrorHandling(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }
    console.error(error);
    return jsonError('Server error', 500);
  }
}
