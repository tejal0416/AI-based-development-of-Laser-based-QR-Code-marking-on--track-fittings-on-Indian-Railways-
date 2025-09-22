'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate an inspection summary for a rail part.
 *
 * It uses the part's inspection history to create a plain-language summary, helping users
 * quickly assess if a new inspection is needed.
 *
 * @exports generateInspectionSummary - The main function to generate the inspection summary.
 * @exports GenerateInspectionSummaryInput - The input type for the generateInspectionSummary function.
 * @exports GenerateInspectionSummaryOutput - The return type for the generateInspectionSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspectionSummaryInputSchema = z.object({
  partName: z.string().describe('The name of the rail part.'),
  inspectionHistory: z.string().describe('The inspection history of the rail part.'),
});
export type GenerateInspectionSummaryInput = z.infer<typeof GenerateInspectionSummaryInputSchema>;

const GenerateInspectionSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the inspection history.'),
});
export type GenerateInspectionSummaryOutput = z.infer<typeof GenerateInspectionSummaryOutputSchema>;

export async function generateInspectionSummary(
  input: GenerateInspectionSummaryInput
): Promise<GenerateInspectionSummaryOutput> {
  return generateInspectionSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInspectionSummaryPrompt',
  input: {schema: GenerateInspectionSummaryInputSchema},
  output: {schema: GenerateInspectionSummaryOutputSchema},
  prompt: `You are an AI assistant that helps rail workers determine if a rail part needs inspection. You are provided with the part's inspection history.

Part Name: {{{partName}}}
Inspection History: {{{inspectionHistory}}}

Create a concise summary (around 50 words) to determine if a new inspection is recommended.`,
});

const generateInspectionSummaryFlow = ai.defineFlow(
  {
    name: 'generateInspectionSummaryFlow',
    inputSchema: GenerateInspectionSummaryInputSchema,
    outputSchema: GenerateInspectionSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
