const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateAIResponse(
  messages: ChatMessage[],
  integrations: { shopify: boolean; crm: boolean }
): Promise<{ response: string; steps: string[] }> {
  try {
    const steps: string[] = [];

    let systemContext = "You are a helpful AI Sales Assistant.";

    if (integrations.shopify) {
      steps.push("Checking Shopify store data...");
      systemContext += `
        You have access to Shopify store data:
        - Total products: 150
        - Active orders: 23
        - Revenue this month: $12,450
        - Top product: Premium Widget ($299)
        - Low stock items: 5 products
      `;
    }

    if (integrations.crm) {
      steps.push("Fetching CRM customer data...");
      systemContext += `
        You have access to CRM data:
        - Total customers: 1,234
        - New leads this week: 45
        - Conversion rate: 12%
        - Top customer: Acme Corp ($50,000 lifetime value)
        - Pending follow-ups: 8
      `;
    }

    steps.push("Analyzing your request...");
    steps.push("Generating response...");

    const geminiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const allMessages = [
      {
        role: "user",
        parts: [{ text: systemContext }],
      },
      {
        role: "model",
        parts: [{ text: "Understood! I am ready to help as your AI Sales Assistant." }],
      },
      ...geminiMessages,
    ];

    console.log("Calling Gemini API...");
    console.log("API Key exists:", !!GEMINI_API_KEY);
    console.log("URL:", GEMINI_URL);

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: allMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    console.log("Gemini response status:", response.status);
    const data = await response.json();
    console.log("Gemini response data:", JSON.stringify(data));

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response from Gemini");
    }

    return { response: text, steps };
  } catch (error) {
    console.error("AI service error:", error);
    return {
      response: "I apologize, I am having trouble connecting to the AI service right now. Please try again in a moment.",
      steps: ["Error connecting to AI service"],
    };
  }
}