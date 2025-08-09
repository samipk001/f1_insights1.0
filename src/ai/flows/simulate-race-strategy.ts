'use server';

/**
 * @fileOverview An AI agent for simulating F1 race strategies.
 *
 * - simulateRaceStrategy - A function that handles the race strategy simulation process.
 * - SimulateRaceStrategyInput - The input type for the simulateRaceStrategy function.
 * - SimulateRaceStrategyOutput - The return type for the simulateRaceStrategy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StintSchema = z.object({
    compound: z.enum(['Soft', 'Medium', 'Hard']).describe('The tire compound for the stint.'),
    startLap: z.number().describe('The lap the stint starts on.'),
    pitLap: z.number().optional().describe('The lap the driver pits, ending the stint. Omit for the final stint.'),
});

const SimulateRaceStrategyInputSchema = z.object({
  raceName: z.string().describe('The name of the race.'),
  circuitName: z.string().describe('The name of the circuit.'),
  season: z.string().describe('The year of the F1 season.'),
  driverName: z.string().describe('The name of the driver whose strategy is being simulated.'),
  gridPosition: z.number().describe('The driver\'s starting grid position.'),
  totalLaps: z.number().describe('The total number of laps in the race.'),
  actualRaceTime: z.string().describe('The driver\'s actual finishing time or status.'),
  strategy: z.array(StintSchema).describe('An array of stints defining the proposed strategy.'),
  raceResultsData: z.string().describe('JSON string of the full race results for context.'),
});
export type SimulateRaceStrategyInput = z.infer<typeof SimulateRaceStrategyInputSchema>;

const SimulateRaceStrategyOutputSchema = z.object({
    simulatedTime: z.string().describe('The estimated total race time for the simulated strategy.'),
    timeDelta: z.string().describe('The time difference between the simulated strategy and the actual result (e.g., "-5.2s" or "+10.1s").'),
    analysis: z.string().describe('A detailed analysis of the simulated strategy, explaining why it was better or worse. It should cover tire degradation, track position, and traffic considerations.'),
    bestPossibleLap: z.number().describe('The theoretical best lap time achievable with this strategy.'),
    strategyRating: z.enum(['Optimal', 'Competitive', 'Viable', 'Sub-optimal', 'Disastrous']).describe('An overall rating for the proposed strategy.'),
});
export type SimulateRaceStrategyOutput = z.infer<typeof SimulateRaceStrategyOutputSchema>;

export async function simulateRaceStrategy(input: SimulateRaceStrategyInput): Promise<SimulateRaceStrategyOutput> {
  return simulateRaceStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateRaceStrategyPrompt',
  input: {schema: SimulateRaceStrategyInputSchema},
  output: {schema: SimulateRaceStrategyOutputSchema},
  prompt: `You are a Formula 1 race strategy simulation engine. Your task is to analyze a proposed race strategy and compare it to the actual race outcome.

**Race Context:**
- Race: {{{raceName}}}, {{{season}}}
- Circuit: {{{circuitName}}}
- Total Laps: {{{totalLaps}}}
- Driver: {{{driverName}}}
- Grid Position: {{{gridPosition}}}
- Actual Result: {{{actualRaceTime}}}

**Proposed Strategy:**
{{#each strategy}}
- Stint: Start on lap {{startLap}}, pit on lap {{#if pitLap}}{{pitLap}}{{else}}Finish{{/if}} with {{compound}} tires.
{{/each}}

**Full Race Results (for context on other drivers' pace and traffic):**
{{{raceResultsData}}}

**Simulation Task:**
1.  **Model Tire Degradation:** For each stint, model the expected lap times considering the compound (Softs are fast but degrade quickly, Hards are slow but durable), the fuel load (car is faster as it gets lighter), and circuit characteristics.
2.  **Factor in Pit Stops:** Assume a standard pit stop time loss of 22 seconds for each pit stop.
3.  **Consider Track Position:** Analyze how the strategy would affect track position and potential traffic. Would the driver emerge in clean air or behind slower cars?
4.  **Calculate Simulated Race Time:** Sum the estimated lap times for all stints and pit stops to get a total simulated race time.
5.  **Calculate Performance Delta:** Compare your simulated time to the driver's actual race time.
6.  **Provide a Detailed Analysis:** Explain the pros and cons of the proposed strategy. Was it aggressive? Did it manage tires well? How did it impact the race overall?
7.  **Rate the Strategy:** Give an overall rating from "Optimal" to "Disastrous".

Based on this comprehensive simulation, provide the output in the required format.`,
});

const simulateRaceStrategyFlow = ai.defineFlow(
  {
    name: 'simulateRaceStrategyFlow',
    inputSchema: SimulateRaceStrategyInputSchema,
    outputSchema: SimulateRaceStrategyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
