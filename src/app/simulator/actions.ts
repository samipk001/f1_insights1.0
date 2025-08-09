
"use server";

import { simulateRaceStrategy, type SimulateRaceStrategyInput, type SimulateRaceStrategyOutput } from '@/ai/flows/simulate-race-strategy';

export async function getStrategySimulation(input: SimulateRaceStrategyInput): Promise<SimulateRaceStrategyOutput | null> {
    try {
        const result = await simulateRaceStrategy(input);
        return result;
    } catch (error) {
        console.error("Error generating race simulation:", error);
        return null;
    }
}
