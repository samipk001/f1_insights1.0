
"use server";

import { summarizeRace, type SummarizeRaceInput } from '@/ai/flows/summarize-race';

export async function getRaceAnalysis(input: SummarizeRaceInput): Promise<string | null> {
    try {
        const result = await summarizeRace(input);
        return result.summary;
    } catch (error) {
        console.error("Error generating race analysis:", error);
        return "Failed to generate AI analysis. Please try again.";
    }
}
