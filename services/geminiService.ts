import { GoogleGenAI } from "@google/genai";
import type { AnalysisReportData } from '../types';
import { SYSTEM_INSTRUCTION, RESPONSE_SCHEMA } from '../constants';

export async function analyzeChatLog(chatLog: string, instructorNames: string): Promise<AnalysisReportData> {
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const userPrompt = `
  Here is the chat log. Please analyze it.
  The instructor(s)/host(s) for this session are: ${instructorNames}. Please ignore their messages as per the instructions.

  --- CHAT LOG START ---
  ${chatLog}
  --- CHAT LOG END ---
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: userPrompt,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: "application/json",
            // @ts-ignore - The schema type is compatible
            responseSchema: RESPONSE_SCHEMA,
            thinkingConfig: { thinkingBudget: 32768 }
        },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    return data as AnalysisReportData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('invalid'))) {
        throw new Error("The provided API key is not valid. Please check it and try again.");
    }
    throw new Error("Failed to get a valid analysis from the AI. The content may be malformed or the service may be unavailable.");
  }
}