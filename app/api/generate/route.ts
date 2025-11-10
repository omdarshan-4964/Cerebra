import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { topic, difficulty } = await request.json();

    console.log("📥 API received:", { topic, difficulty });

    // 1️⃣ Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY not set");
      return NextResponse.json(
        { error: "Server misconfiguration: API key missing" },
        { status: 500 }
      );
    }

    // 2️⃣ Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Using model:", model.model);

    // 3️⃣ Build the prompt
    const prompt = `You are an expert learning path designer. Create a comprehensive learning roadmap specifically for "${topic}" at ${difficulty} level.

CRITICAL: The roadmap MUST be about "${topic}" and nothing else.

Return ONLY a valid JSON object (no markdown, no code blocks) with this EXACT structure:

{
  "topic": "${topic}",
  "nodes": [
    {
      "id": "1",
      "title": "Main concept for ${topic}",
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
    }
  ],
  "edges": [
    {"from": "1", "to": "2"}
  ]
}

Requirements:
- Create 7-10 nodes specifically about "${topic}"
- Each node must have unique id (numbers as strings)
- Include 1-2 real resources per node (MDN, official docs, YouTube)
- Use categories: general, frontend, backend, database, fundamentals, tools
- Keep descriptions under 15 words
- Create logical parent-child hierarchy
- Topic field must be exactly: "${topic}"

IMPORTANT: Generate content ONLY about "${topic}". Do not substitute with similar topics.`;

    console.log("🤖 Calling Gemini for:", topic);

    // 4️⃣ Call Gemini
    const result = await model.generateContent(prompt);
    if (!result.response) throw new Error("No response from Gemini");

    const text = result.response.text();
    console.log("📝 Gemini response received, length:", text?.length);

    // 5️⃣ Clean and parse JSON
    let cleanedText = text.trim();
    cleanedText = cleanedText
      .replace(/^```json\s*/i, "")
      .replace(/```$/i, "")
      .replace(/[\u0000-\u001F]+/g, ""); // removes control chars

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ Gemini did not return JSON:", cleanedText.slice(0, 500));
      throw new Error("No valid JSON found in Gemini response");
    }

    const learningMap = JSON.parse(jsonMatch[0]);

    // 6️⃣ Validate structure
    if (!Array.isArray(learningMap.nodes)) {
      throw new Error("Invalid or missing 'nodes' array");
    }
    if (!Array.isArray(learningMap.edges)) {
      throw new Error("Invalid or missing 'edges' array");
    }

    // 7️⃣ Force topic to match request
    learningMap.topic = topic;

    console.log(
      `✅ Successfully generated map for "${learningMap.topic}" with ${learningMap.nodes.length} nodes`
    );

    return NextResponse.json(learningMap);
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
