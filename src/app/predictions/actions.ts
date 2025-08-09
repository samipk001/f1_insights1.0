
"use server";

import { predictRaceWinner, type PredictRaceWinnerInput, type PredictRaceWinnerOutput } from '@/ai/flows/predict-race-winner';

export async function getRacePrediction(input: PredictRaceWinnerInput): Promise<PredictRaceWinnerOutput | null> {
    try {
        const result = await predictRaceWinner(input);
        return result;
    } catch (error) {
        console.error("Error generating race prediction:", error);
        return null;
    }
}
