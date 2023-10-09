import { Configuration, OpenAIApi } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'
 
export const runtime = 'edge'
const OPENAI_API_KEY = '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';
const apiConfig = new Configuration({
  apiKey: OPENAI_API_KEY,
})
 
const openai = new OpenAIApi(apiConfig)
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()
 
  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: messages,
    max_tokens: 500,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  })
 
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
 
  // Respond with the stream
  return new StreamingTextResponse(stream)
}