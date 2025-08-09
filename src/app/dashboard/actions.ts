"use server";

import { summarizeDriverSeason, type SummarizeDriverSeasonInput } from '@/ai/flows/summarize-driver-season';

export async function getDriverSeasonSummary(input: SummarizeDriverSeasonInput): Promise<string | null> {
    try {
        const result = await summarizeDriverSeason(input);
        return result.summary;
    } catch (error) {
        console.error("Error generating driver season summary:", error);
        return "Failed to generate AI summary. Please try again.";
    }
}
