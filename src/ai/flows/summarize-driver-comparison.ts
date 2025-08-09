'use server';

/**
 * @fileOverview A driver comparison summary AI agent.
 *
 * - summarizeDriverComparison - A function that handles the driver comparison summary process.
 * - SummarizeDriverComparisonInput - The input type for the summarizeDriverComparison function.
 * - SummarizeDriverComparisonOutput - The return type for the summarizeDriverComparison function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeDriverComparisonInputSchema = z.object({
  driver1Name: z.string().describe('The name of the first driver.'),
  driver2Name: z.string().describe('The name of the second driver.'),
  wins1: z.number().describe('Number of wins for the first driver.'),
  wins2: z.number().describe('Number of wins for the second driver.'),
  podiums1: z.number().describe('Number of podiums for the first driver.'),
  podiums2: z.number().describe('Number of podiums for the second driver.'),
  qualiBattles1: z.number().describe('Number of qualifying battles won by the first driver.'),
  qualiBattles2: z.number().describe('Number of qualifying battles won by the second driver.'),
  dnfs1: z.number().describe('Number of DNFs for the first driver.'),
  dnfs2: z.number().describe('Number of DNFs for the second driver.'),
  teamHistory1: z.string().describe('Team history for the first driver.'),
  teamHistory2: z.string().describe('Team history for the second driver.'),
  season: z.string().describe('The season the drivers are being compared in.'),
});
export type SummarizeDriverComparisonInput = z.infer<typeof SummarizeDriverComparisonInputSchema>;

const SummarizeDriverComparisonOutputSchema = z.object({
  summary: z.string().describe('A summary of the driver comparison.'),
});
export type SummarizeDriverComparisonOutput = z.infer<typeof SummarizeDriverComparisonOutputSchema>;

export async function summarizeDriverComparison(input: SummarizeDriverComparisonInput): Promise<SummarizeDriverComparisonOutput> {
  return summarizeDriverComparisonFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeDriverComparisonPrompt',
  input: {schema: SummarizeDriverComparisonInputSchema},
  output: {schema: SummarizeDriverComparisonOutputSchema},
  prompt: `You are an expert Formula 1 analyst. You are given data comparing two drivers and your job is to write a short summary highlighting the key statistics and insights about the two drivers.

Driver 1: {{{driver1Name}}}
Driver 2: {{{driver2Name}}}
Season: {{{season}}}

Wins for {{{driver1Name}}}: {{{wins1}}}
Wins for {{{driver2Name}}}: {{{wins2}}}

Podiums for {{{driver1Name}}}: {{{podiums1}}}
Podiums for {{{driver2Name}}}: {{{podiums2}}}

Qualifying Battles Won by {{{driver1Name}}}: {{{qualiBattles1}}}
Qualifying Battles Won by {{{driver2Name}}}: {{{qualiBattles2}}}

DNFs for {{{driver1Name}}}: {{{dnfs1}}}
DNFs for {{{driver2Name}}}: {{{dnfs2}}}

Team History for {{{driver1Name}}}: {{{teamHistory1}}}
Team History for {{{driver2Name}}}: {{{teamHistory2}}}

Write a concise summary of the comparison between the two drivers, highlighting their strengths and weaknesses. Focus on the key differences in their performance and career.
`,
});

const summarizeDriverComparisonFlow = ai.defineFlow(
  {
    name: 'summarizeDriverComparisonFlow',
    inputSchema: SummarizeDriverComparisonInputSchema,
    outputSchema: SummarizeDriverComparisonOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
