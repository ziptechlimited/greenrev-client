import inventoryData from '@/data/inventory.json';

export const maxDuration = 30;

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return new Response(
      "Error: OPENROUTER_API_KEY is missing. Please add it to your .env.local file to enable the AI Concierge.", 
      { status: 500 }
    );
  }

  const { messages } = await req.json();
  const inventoryContext = JSON.stringify(inventoryData, null, 2);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://greenrevmotors.com', // Required for some OpenRouter models
      'X-Title': 'Sarkin Mota AI Concierge',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: `You are the Sarkin Mota AI Concierge, a world-class automotive expert. 
Our exclusive inventory: ${inventoryContext}

Guidelines:
1. Be sophisticated, professional, and helpful.
2. Recommend cars based on user budget (₦) and specs.
3. Compare cars side-by-side if asked.
4. If unavailable, suggest the closest match.
5. Use markdown for readability (bolding, lists).
6. State Horsepower, 0-100 time, and Price when recommending.
Always use exact car names.`
        },
        ...messages
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("OpenRouter Error:", error);
    return new Response(
      error?.error?.message || "Failed to connect to OpenRouter", 
      { status: response.status }
    );
  }

  return new Response(response.body);
}
