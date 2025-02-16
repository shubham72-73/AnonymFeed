import { NextResponse } from 'next/server';
import axios from 'axios';

interface Part {
  text: string;
}

interface Content {
  parts: Part[];
}

interface Candidate {
  content: Content;
  finishReason: string;
  avgLogprobs: number;
}

interface ApiResponse {
  candidates: Candidate[];
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelVersion: string;
}

export async function POST(req: Request) {
  const hardcodedPrompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform. Avoid questions related to superpowers, skills. Can include topics from technology, books, climate, career, feedback on some topic."

  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("Missing GOOGLE_API_KEY environment variable.");
    }

    const apiResponse = await axios.post<ApiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        contents: [{
          parts: [
            {
              text: hardcodedPrompt
            }
          ]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = apiResponse.data;
    // console.log("Raw API Response backend:", data);

    if (data.candidates && data.candidates.length > 0) {
      const suggestions: string[] = [];
      data.candidates.forEach((candidate: Candidate) => {
        if (candidate.content && candidate.content.parts) {
          candidate.content.parts.forEach((part: Part) => {
            suggestions.push(part.text);
          });
        }
      });

      console.log("Extracted Suggestions:", suggestions);
      return NextResponse.json(suggestions, { status: 200 });
    } else {
      console.log("No candidates returned.");
      return NextResponse.json([{ text: "No suggestions returned." }], { status: 200 });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    if (axios.isAxiosError(error)) {
        console.error("Axios Error Response:", error.response);
        return NextResponse.json(
          {
            error:
              error.response?.data?.error?.message ||
              error.message ||
              'Failed to generate suggestions',
          },
          { status: error.response?.status || 500 }
        );
      } else {
        return NextResponse.json(
          { error: error.message || 'Failed to generate suggestions' },
          { status: 500 }
        );
      }
  }
}

// https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}