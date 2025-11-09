import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { detectRoadmap } from '../../../lib/roadmap-detector';
import ROADMAP_TEMPLATES from '../../../lib/roadmap-templates';

export async function POST(request: Request) {
  try {
    const { topic = '', difficulty = 'beginner' } = (await request.json()) as {
      topic?: string;
      difficulty?: string;
    };

    // First, try to detect a curated template
    const detected = detectRoadmap(topic || '');
    if (detected) {
      // Attach metadata if using curated template
      return NextResponse.json({ ...detected, templateSource: 'curated' });
    }

    // Fallback to generative API
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set!');
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert learning path designer. Create a comprehensive learning roadmap for "${topic}" at ${difficulty} level. Return ONLY a valid JSON object describing topic, nodes and edges. Use realistic resource URLs (MDN, official docs, YouTube, etc.). Keep descriptions short (<=15 words).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to extract JSON from possibly noisy text
    let cleanedText = text.trim();
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in response');
      throw new Error('Invalid response format - no JSON found');
    }

    const learningMap = JSON.parse(jsonMatch[0]);

    // Basic validation
    if (!learningMap.nodes || !Array.isArray(learningMap.nodes)) {
      throw new Error('Invalid response: missing nodes array');
    }
    if (!learningMap.edges || !Array.isArray(learningMap.edges)) {
      throw new Error('Invalid response: missing edges array');
    }

    return NextResponse.json({ ...learningMap, templateSource: 'generated' });
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate learning map: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to generate learning map' }, { status: 500 });
  }
}