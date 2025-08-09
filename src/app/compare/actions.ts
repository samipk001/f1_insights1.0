"use server";

import { summarizeDriverComparison, type SummarizeDriverComparisonInput } from '@/ai/flows/summarize-driver-comparison';

export async function getComparisonSummary(input: SummarizeDriverComparisonInput): Promise<string | null> {
    try {
        const result = await summarizeDriverComparison(input);
        return result.summary;
    } catch (error) {
        console.error("Error generating driver comparison summary:", error);
        return null;
    }
}
