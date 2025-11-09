import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const ok = true;
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json({ ok, geminiConfigured });
}
