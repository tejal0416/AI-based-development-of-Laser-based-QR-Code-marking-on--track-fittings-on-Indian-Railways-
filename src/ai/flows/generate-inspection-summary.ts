
'use server';

/**
 * @fileOverview This file defines a Genkit flow to generate an inspection summary for a rail part.
 *
 * It uses the part's inspection history to create a plain-language summary, helping users
 * quickly assess if a new inspection is needed.
 *
 * @exports generateInspectionSummary - The main function to generate the inspection summary.
 * @exports GenerateInspectionSummaryInput - The input type for the generateInspectionSummary function.
 * @exports GenerateInspectionSummaryOutput - The return type for the generateInspectionsummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspectionSummaryInputSchema = z.object({
  partName: z.string().describe('The name of the rail part.'),
  inspectionHistory: z.string().describe('A newline-separated list of past inspections, including date, status, and inspector.'),
});
export type GenerateInspectionSummaryInput = z.infer<typeof GenerateInspectionSummaryInputSchema>;

const GenerateInspectionSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, plain-language summary of the inspection history and a recommendation on whether a new inspection is needed.'),
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
  prompt: `You are an expert AI assistant for the RailWatch app. Your job is to help rail maintenance workers quickly understand the status of a part and decide if it needs a new inspection.

You will be given the part's name and its inspection history.

Part Name: {{{partName}}}
Inspection History:
{{{inspectionHistory}}}

Analyze the history and provide a concise summary (about 40-60 words). If the latest inspection status is 'Failed' or 'Needs Repair', make a special note highlighting that the part is defective and requires immediate attention. Conclude with a clear recommendation: "New inspection recommended," "No immediate inspection needed," or "Monitor part closely." Base your recommendation on the time since the last inspection, the status of past inspections, and any recurring issues.`,
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
