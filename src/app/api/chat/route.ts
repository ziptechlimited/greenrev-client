import { streamText, tool } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

export const maxDuration = 30;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return new Response("Error: OPENROUTER_API_KEY is missing.", { status: 500 });
  }

  const { messages, compareData } = await req.json();

  const openrouter = createOpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
  });

  // Only include compare-specific context if cars are selected — keeps the base prompt tiny
  const compareContext = compareData?.length > 0
    ? `\n\nThe user is currently comparing these vehicles in the compare view:\n${JSON.stringify(
        compareData.map((c: any) => ({
          name: c.name,
          make: c.make,
          price: c.price,
          horsepower: c.specs?.horsepower,
          topSpeed: c.specs?.topSpeed,
          '0_100': c.specs?.['0_100'],
          torque: c.specs?.torque,
        })),
        null,
        2
      )}`
    : '';

  const result = await streamText({
    model: openrouter('google/gemini-2.0-flash-001'),
    system: `You are the GreenRev Moto AI Concierge, a world-class automotive expert for a premium Nigerian car dealership.${compareContext}

Guidelines:
- Be sophisticated, professional, and conversational.
- Use markdown for readability: **bold** for key specs, bullet lists for comparisons.
- Give definitive, opinionated recommendations when asked.
- If the user asks about what else is in the showroom, alternative cars, or anything requiring live inventory knowledge, call the search_showroom tool.
- Do NOT make up car names or prices — only reference real vehicles from your compare context or from tool results.`,
    messages,
    tools: {
      search_showroom: tool({
        description:
          'Fetches the live showroom inventory. Call this when the user asks about what cars are available, alternatives, or wants to compare against the broader inventory.',
        parameters: z.object({
          reason: z
            .string()
            .describe('Brief reason why inventory is needed, e.g. "user asked for alternatives to Lexus LX 600"'),
        }),
        // @ts-ignore
        execute: async (args: any) => {
          const { reason } = args;
          console.log(`[Tool: search_showroom] Reason: ${reason}`);
          try {
            const res = await fetch(`${API_BASE}/api/v1/products?category=vehicle`);
            if (!res.ok) return { error: 'Could not reach inventory database.' };
            const data = await res.json();
            if (!data.success || !data.data.products) return { vehicles: [] };

            // Return lightweight summary only — no images, no descriptions
            const vehicles = data.data.products.map((p: any) => ({
              name: p.name,
              make: p.make,
              price: p.price,
              horsepower: p.specs?.horsepower,
              topSpeed: p.specs?.topSpeed,
              '0_100': p.specs?.['0_100'],
              torque: p.specs?.torque,
            }));

            return { vehicles, total: vehicles.length };
          } catch (e) {
            return { error: 'Failed to fetch inventory from the database.' };
          }
        },
      }),
    }
  });

  // @ts-ignore
  return result.toUIMessageStreamResponse();
}
