import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();

    const content = fd.get("content") as string;
    const title = fd.get("title") as string;

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const prompt = `
    You are an expert Social Media Analyzer. Analyze the following content and title for sensitive or inappropriate content.
    You must respond with ONLY the word 'true' or 'false'.
    - Respond 'true' if the content is inappropriate or sensitive
    - Respond 'false' if the content is appropriate and not sensitive
    Do not include any other text, special characters, or explanations.

    Title: ${title}
    Content: ${content}
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().toLowerCase().trim();
    let finalAns;

    // Clean the response to ensure only true/false
    if (response.includes("true")) {
      finalAns = true;
    } else if (response.includes("false")) {
      finalAns = false;
    } else {
      // Handle unexpected responses
      throw new Error("Invalid response format - expected true or false");
    }

    return NextResponse.json(
      { message: "Content checked", success: true, result: finalAns },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, success: false },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error", success: false },
        { status: 500 }
      );
    }
  }
}
