
"use server";

import { calculateConsistencyIndex, type CalculateConsistencyIndexInput, type CalculateConsistencyIndexOutput } from '@/ai/flows/calculate-consistency-index';

export async function getConsistencyIndex(input: CalculateConsistencyIndexInput): Promise<CalculateConsistencyIndexOutput | null> {
    try {
        const result = await calculateConsistencyIndex(input);
        return result;
    } catch (error) {
        console.error("Error generating consistency index:", error);
        return null;
    }
}
