'use server';

/**
 * @fileOverview A race and season summary AI agent.
 *
 * - summarizeRaceSeason - A function that handles the summarization process.
 * - SummarizeRaceSeasonInput - The input type for the summarizeRaceSeason function.
 * - SummarizeRaceSeasonOutput - The return type for the summarizeRaceSeason function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRaceSeasonInputSchema = z.object({
  season: z.string().describe('The year of the F1 season to summarize.'),
  race: z.string().optional().describe('The specific race to summarize (e.g., "Monaco Grand Prix"). If omitted, the entire season is summarized.'),
  ergastData: z.string().describe('Data from the Ergast API about the season or race.'),
});
export type SummarizeRaceSeasonInput = z.infer<typeof SummarizeRaceSeasonInputSchema>;

const SummarizeRaceSeasonOutputSchema = z.object({
  summary: z.string().describe('A summary of the race or season, highlighting key events, driver performances, and championship implications.'),
});
export type SummarizeRaceSeasonOutput = z.infer<typeof SummarizeRaceSeasonOutputSchema>;

export async function summarizeRaceSeason(input: SummarizeRaceSeasonInput): Promise<SummarizeRaceSeasonOutput> {
  return summarizeRaceSeasonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRaceSeasonPrompt',
  input: {schema: SummarizeRaceSeasonInputSchema},
  output: {schema: SummarizeRaceSeasonOutputSchema},
  prompt: `You are an expert Formula 1 analyst. You are provided with data from the Ergast API about a specific race or season.  Your task is to summarize the key events, driver performances, and championship implications.

Season: {{{season}}}
Race: {{#if race}}{{{race}}}{{else}}Full Season{{/if}}
Data: {{{ergastData}}}

Summary:`, // Note: The prompt should end with "Summary:" so the model continues from there.
});

const summarizeRaceSeasonFlow = ai.defineFlow(
  {
    name: 'summarizeRaceSeasonFlow',
    inputSchema: SummarizeRaceSeasonInputSchema,
    outputSchema: SummarizeRaceSeasonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
