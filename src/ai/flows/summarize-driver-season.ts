'use server';

/**
 * @fileOverview An AI agent for summarizing a driver's F1 season.
 *
 * - summarizeDriverSeason - A function that handles the driver season summarization process.
 * - SummarizeDriverSeasonInput - The input type for the summarizeDriverSeason function.
 * - SummarizeDriverSeasonOutput - The return type for the summarizeDriverSeason function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDriverSeasonInputSchema = z.object({
  driverName: z.string().describe('The name of the driver.'),
  season: z.string().describe('The year of the F1 season.'),
  raceResults: z.string().describe('JSON string of the race results for the driver this season.'),
});
export type SummarizeDriverSeasonInput = z.infer<typeof SummarizeDriverSeasonInputSchema>;

const SummarizeDriverSeasonOutputSchema = z.object({
  summary: z.string().describe("A narrative summary of the driver's season performance, including highlights, low points, and overall assessment."),
});
export type SummarizeDriverSeasonOutput = z.infer<typeof SummarizeDriverSeasonOutputSchema>;

export async function summarizeDriverSeason(input: SummarizeDriverSeasonInput): Promise<SummarizeDriverSeasonOutput> {
  return summarizeDriverSeasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDriverSeasonPrompt',
  input: {schema: SummarizeDriverSeasonInputSchema},
  output: {schema: SummarizeDriverSeasonOutputSchema},
  prompt: `You are an expert Formula 1 analyst. You are given data about a driver's performance over a season. Your task is to write a concise but insightful summary.

Driver: {{{driverName}}}
Season: {{{season}}}
Race-by-Race Results (JSON): {{{raceResults}}}

Analyze the provided results. Based on this data, write a summary covering:
- Their overall performance and consistency.
- Any standout results or highlights (e.g., podiums, surprise results).
- Any notable low points or periods of struggle.
- A final concluding sentence about their season so far.

Write the summary in an engaging, analytical style suitable for a sports expert's column.`,
});

const summarizeDriverSeasonFlow = ai.defineFlow(
  {
    name: 'summarizeDriverSeasonFlow',
    inputSchema: SummarizeDriverSeasonInputSchema,
    outputSchema: SummarizeDriverSeasonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
