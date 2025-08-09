'use server';

/**
 * @fileOverview A race summary AI agent.
 *
 * - summarizeRace - A function that handles the race summarization process.
 * - SummarizeRaceInput - The input type for the summarizeRace function.
 * - SummarizeRaceOutput - The return type for the summarizeRace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRaceInputSchema = z.object({
  season: z.string().describe('The year of the F1 season.'),
  raceName: z.string().describe('The name of the race.'),
  raceData: z.string().describe('JSON string of the race data, including results.'),
});
export type SummarizeRaceInput = z.infer<typeof SummarizeRaceInputSchema>;

const SummarizeRaceOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A detailed summary of the race. Analyze key events, overtakes, turning points, and standout driver performances based on the provided results data. Compare final positions to grid positions to identify drivers who gained or lost the most.'
    ),
});
export type SummarizeRaceOutput = z.infer<typeof SummarizeRaceOutputSchema>;

export async function summarizeRace(input: SummarizeRaceInput): Promise<SummarizeRaceOutput> {
  return summarizeRaceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRacePrompt',
  input: {schema: SummarizeRaceInputSchema},
  output: {schema: SummarizeRaceOutputSchema},
  prompt: `You are an expert Formula 1 analyst. You are provided with JSON data for a specific race. Your task is to write a detailed analysis of the race.

Season: {{{season}}}
Race: {{{raceName}}}

Race Data (JSON):
{{{raceData}}}

Based on the data, provide a summary of the race. Focus on:
- Key turning points or incidents.
- Standout driver performances (e.g., who gained the most positions from their grid start?).
- Analysis of the podium finishers.
- Mention the driver who achieved the fastest lap.
- Any surprising results or notable underperformances.

Write the summary in a narrative, engaging style suitable for a sports journalism website.`,
});

const summarizeRaceFlow = ai.defineFlow(
  {
    name: 'summarizeRaceFlow',
    inputSchema: SummarizeRaceInputSchema,
    outputSchema: SummarizeRaceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
