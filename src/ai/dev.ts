import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-driver-comparison.ts';
import '@/ai/flows/summarize-race-season.ts';
import '@/ai/flows/summarize-race.ts';
import '@/ai/flows/predict-race-winner.ts';
import '@/ai/flows/summarize-driver-season.ts';
import '@/ai/flows/simulate-race-strategy.ts';
import '@/ai/flows/calculate-consistency-index.ts';
