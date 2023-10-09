import { NextRequest } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const { message } = req;
    if (!message) {
      return new Response('Prompt is required', {
        status: 400
      });
    }

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: message }],
        model: "gpt-3.5-turbo",
    });

    const aiMessage = completion.choices[0].message.content;
    return new Response(JSON.stringify({ message: aiMessage }));
  } catch (error) {
    console.error('Error querying OpenAI API:', error);
    return new Response('Error querying OpenAI API', {
        status: 500
    });
  }
}