import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
    try {
        const { results } = await req.json();

        const prompt = `You are an empathetic, encouraging corporate trainer. A user just finished a Microsoft Excel Training Needs Assessment.
Here are their results: ${JSON.stringify(results)}

Based on these results, write a short, warm, and encouraging introductory message praising their effort, and suggest 3 specific, actionable training topics they should focus on.
Return the response STRICTLY as a JSON object with this exact structure:
{
  "introMessage": "A warm, empathetic 1-2 sentence introduction.",
  "recommendations": [
    {
      "topic": "Name of the topic",
      "description": "Why this will help them, written in an encouraging tone."
    }
  ]
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });

        const rawText = response.text ?? "";
        const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
        const aiData = JSON.parse(cleaned || "{}");
        return NextResponse.json({ aiData });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("AI Generation Error:", msg);
        return NextResponse.json({ error: "Failed to generate recommendations", detail: msg }, { status: 500 });
    }
}
