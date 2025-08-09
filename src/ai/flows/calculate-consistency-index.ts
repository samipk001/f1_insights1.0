'use server';

/**
 * @fileOverview An AI agent for calculating a driver's consistency index.
 *
 * - calculateConsistencyIndex - A function that handles the consistency index calculation.
 * - CalculateConsistencyIndexInput - The input type for the function.
 * - CalculateConsistencyIndexOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateConsistencyIndexInputSchema = z.object({
  driverName: z.string().describe('The name of the driver.'),
  season: z.string().describe('The year of the F1 season.'),
  raceResults: z.string().describe('JSON string of the race results for the driver this season, including grid position, final position, and status.'),
});
export type CalculateConsistencyIndexInput = z.infer<typeof CalculateConsistencyIndexInputSchema>;

const CalculateConsistencyIndexOutputSchema = z.object({
  consistencyIndex: z.number().min(0).max(100).describe('A score from 0 (wildly inconsistent) to 100 (perfectly consistent and flawless).'),
  analysis: z.string().describe('A detailed analysis explaining the score. It should cover performance relative to starting position, ability to finish races, and any inferred penalties or incidents.'),
  positiveFactors: z.array(z.string()).describe('A list of key positive factors contributing to the score (e.g., "Gained 10 positions in the Spanish GP").'),
  negativeFactors: z.array(z.string()).describe('A list of key negative factors detracting from the score (e.g., "Multiple unforced errors in wet conditions").'),
});
export type CalculateConsistencyIndexOutput = z.infer<typeof CalculateConsistencyIndexOutputSchema>;

export async function calculateConsistencyIndex(input: CalculateConsistencyIndexInput): Promise<CalculateConsistencyIndexOutput> {
  return calculateConsistencyIndexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateConsistencyIndexPrompt',
  input: {schema: CalculateConsistencyIndexInputSchema},
  output: {schema: CalculateConsistencyIndexOutputSchema},
  prompt: `You are a Formula 1 performance analyst specializing in driver consistency. Your task is to create a "Driver Consistency Index" based on a driver's performance throughout a season.

**Driver:** {{{driverName}}}
**Season:** {{{season}}}
**Race-by-Race Results (JSON):** {{{raceResults}}}

**Your Goal:**
Calculate a **Consistency Index** on a scale of 0 to 100, where 100 is a flawless season and 0 is a season plagued by errors and poor performance.

**Analyze the following factors from the data:**
1.  **Qualifying vs. Race Delta:** This is the most important factor. Consistently finishing higher than the starting grid position is a strong sign of consistency and race craft. Finishing lower suggests inconsistency or mistakes.
2.  **Finishing Record (DNFs):** A consistent driver finishes races. Analyze the 'status' field. DNFs (Did Not Finish) due to driver error (e.g., 'Collision', 'Spun off') should heavily penalize the score. Mechanical failures (e.g., 'Engine', 'Gearbox') should be noted but have a smaller impact on the *driver's* consistency score.
3.  **Gaining/Losing Positions:** Look at the 'grid' vs 'position' for each race. Create a summary of key races where the driver made significant gains or losses.
4.  **Penalties:** While not explicitly listed, you can sometimes infer penalties from the 'status' field (e.g., "+5 second penalty"). If you see evidence of penalties, this should negatively impact the score.

**Output:**
1.  **consistencyIndex:** A single number from 0-100.
2.  **analysis:** A detailed paragraph explaining your reasoning for the score, referencing specific races and the factors you analyzed.
3.  **positiveFactors:** A list of the most significant positive contributions to their consistency.
4.  **negativeFactors:** A list of the most significant negative contributions.

Provide your full analysis in the required output format.`,
});

const calculateConsistencyIndexFlow = ai.defineFlow(
  {
    name: 'calculateConsistencyIndexFlow',
    inputSchema: CalculateConsistencyIndexInputSchema,
    outputSchema: CalculateConsistencyIndexOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
