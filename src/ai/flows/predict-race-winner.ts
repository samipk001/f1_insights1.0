'use server';

/**
 * @fileOverview An AI agent for predicting F1 race winners.
 *
 * - predictRaceWinner - A function that handles the race prediction process.
 * - PredictRaceWinnerInput - The input type for the predictRaceWinner function.
 * - PredictRaceWinnerOutput - The return type for the predictRaceWinner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictRaceWinnerInputSchema = z.object({
  raceName: z.string().describe('The name of the race.'),
  circuitName: z.string().describe('The name of the circuit.'),
  season: z.string().describe('The year of the F1 season.'),
  qualifyingResults: z.string().optional().describe('JSON string of the qualifying results, showing grid positions. This may not be available for future races.'),
  driverStandings: z.string().describe('JSON string of the current driver standings.'),
  recentDriverForm: z.string().describe('JSON string of results from the last few races to show recent driver form.'),
});
export type PredictRaceWinnerInput = z.infer<typeof PredictRaceWinnerInputSchema>;

const PredictedDriverSchema = z.object({
    driverName: z.string().describe('The full name of the driver.'),
    predictedPosition: z.number().describe('The predicted finishing position (1-5).'),
    confidence: z.number().min(0).max(100).describe('A confidence score (0-100) for this specific prediction.'),
    rationale: z.string().describe('A detailed rationale for why this driver is predicted to finish in this position, analyzing their strengths and the race context.'),
    keyFactor: z.string().describe('The single most important factor for this driver\'s success in this race (e.g., "Tyre Management", "Raw Pace", "Wet Weather Skills").'),
});

const PredictRaceWinnerOutputSchema = z.object({
    top5: z.array(PredictedDriverSchema).length(5).describe('An array of the top 5 predicted finishers, ordered from 1st to 5th.'),
    summary: z.string().describe('A brief, overall summary of the race prediction, highlighting the main battle to watch.'),
});
export type PredictRaceWinnerOutput = z.infer<typeof PredictRaceWinnerOutputSchema>;

export async function predictRaceWinner(input: PredictRaceWinnerInput): Promise<PredictRaceWinnerOutput> {
  return predictRaceWinnerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictRaceWinnerPrompt',
  input: {schema: PredictRaceWinnerInputSchema},
  output: {schema: PredictRaceWinnerOutputSchema},
  prompt: `You are a world-class Formula 1 analyst with a knack for accurate predictions. You are given data for an upcoming race and your task is to predict the top 5 finishers and provide a detailed rationale for each.

Analyze the provided data carefully:
- Race: {{{raceName}}}
- Circuit: {{{circuitName}}}
- Season: {{{season}}}
{{#if qualifyingResults}}- Qualifying Results: {{{qualifyingResults}}}{{else}}- Qualifying Results: Not yet available.{{/if}}
- Current Driver Standings: {{{driverStandings}}}
- Recent Driver Form (last 3 races): {{{recentDriverForm}}}

Based on your comprehensive analysis of all the data, predict the top 5 finishers in order from 1st to 5th.

For each of the 5 drivers, provide:
1.  **Predicted Position**: Their finishing place (1, 2, 3, 4, 5).
2.  **Confidence Score**: Your confidence in this prediction on a scale of 0-100.
3.  **Key Factor**: The single most important factor for their predicted success.
4.  **Rationale**: A detailed paragraph explaining your reasoning, considering track characteristics, car performance, driver form, and championship context.
{{#unless qualifyingResults}}
- Your rationale should acknowledge that qualifying has not happened yet and that the final grid order could significantly impact the outcome. Base the prediction on form, standings, and historical data.
{{/unless}}

Finally, provide an overall summary of what you expect from the race.
`,
});

const predictRaceWinnerFlow = ai.defineFlow(
  {
    name: 'predictRaceWinnerFlow',
    inputSchema: PredictRaceWinnerInputSchema,
    outputSchema: PredictRaceWinnerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
