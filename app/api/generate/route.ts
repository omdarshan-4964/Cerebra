import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: Request) {
  try {
    const { topic, difficulty } = await request.json();

    console.log('Generating map for:', topic, difficulty);

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set!');
      return NextResponse.json(
        { error: 'API key not configured. Please add GEMINI_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert learning path designer. Create a comprehensive learning roadmap for "${topic}" at ${difficulty} level.

Return ONLY a valid JSON object (no markdown, no code blocks, no explanations) with this EXACT structure:

{
  "topic": "${topic}",
  "nodes": [
    {
      "id": "1",
      "title": "Main Topic Name",
      "description": "Brief 10-15 word description",
      "level": "${difficulty}",
      "category": "general",
      "resources": [
        {
          "type": "article",
          "title": "Resource name",
          "url": "https://example.com"
        }
      ],
      "children": ["2", "3"]
    },
    {
      "id": "2",
      "title": "Subtopic 1",
      "description": "Brief description",
      "level": "${difficulty}",
      "category": "frontend",
      "resources": [
        {
          "type": "video",
          "title": "Video tutorial",
          "url": "https://youtube.com"
        }
      ],
      "children": ["4", "5"]
    }
  ],
  "edges": [
    {"from": "1", "to": "2"},
    {"from": "1", "to": "3"}
  ]
}

REQUIREMENTS:
- Create exactly 8-10 nodes
- Each node MUST have a unique id (use numbers: "1", "2", "3", etc.)
- First node (id "1") is the main topic with no parents
- Create a tree hierarchy using children arrays
- edges array should match the parent-child relationships
- Include 1-2 real resources per node (use actual URLs like MDN, YouTube, official docs)
- Use categories: general, frontend, backend, database, fundamentals, tools
- Keep descriptions under 15 words
- Make it logical and progressive

Return ONLY the JSON object, nothing else.`;

    console.log('Calling Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini response received:', text.substring(0, 200) + '...');

    // Parse JSON (handle markdown if present)
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Find the JSON object
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No JSON found in response');
      throw new Error('Invalid response format - no JSON found');
    }

    const learningMap = JSON.parse(jsonMatch[0]);

    // Validate the response
    if (!learningMap.nodes || !Array.isArray(learningMap.nodes)) {
      throw new Error('Invalid response: missing nodes array');
    }
    
    if (!learningMap.edges || !Array.isArray(learningMap.edges)) {
      throw new Error('Invalid response: missing edges array');
    }

    console.log('Successfully generated map with', learningMap.nodes.length, 'nodes');

    return NextResponse.json(learningMap);
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate learning map: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate learning map' },
      { status: 500 }
    );
  }
}