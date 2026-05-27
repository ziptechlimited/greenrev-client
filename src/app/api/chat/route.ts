export const maxDuration = 30;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:5050";

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    return new Response(
      "Error: OPENROUTER_API_KEY is missing. Please add it to your .env.local file to enable the AI Concierge.", 
      { status: 500 }
    );
  }

  const { messages, compareData } = await req.json();

  let systemPromptContext = "";

  if (compareData && Array.isArray(compareData) && compareData.length > 0) {
    // Highly optimal: use exact car details passed from the client context
    systemPromptContext = `The user is currently comparing these specific vehicles:\n${JSON.stringify(compareData, null, 2)}\n\nGuidelines for comparison:
1. Provide a detailed side-by-side comparison.
2. Highlight which car wins in terms of horsepower, acceleration, and value.
3. Keep the conversational nature and give professional automotive advice.
4. If asked which is better, provide a definitive recommendation based on their intended use.`;
  } else {
    // Fetch live inventory from database
    let inventoryContext = "No inventory available currently.";
    try {
      const res = await fetch(`${API_BASE}/api/v1/products?category=vehicle`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data.products) {
          inventoryContext = JSON.stringify(data.data.products, null, 2);
        }
      }
    } catch (error) {
      console.error("Failed to fetch inventory for chat context:", error);
    }
    
    systemPromptContext = `Our exclusive inventory: ${inventoryContext}\n\nGuidelines:
1. Be sophisticated, professional, and helpful.
2. Recommend cars based on user budget (₦) and specs.
3. Compare cars side-by-side if asked.
4. If unavailable, suggest the closest match.
5. Use markdown for readability (bolding, lists).
6. State Horsepower, 0-100 time, and Price when recommending.
Always use exact car names.`;
  }

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
${systemPromptContext}`
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
