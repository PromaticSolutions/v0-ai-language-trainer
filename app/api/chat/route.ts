import { generateText } from 'ai'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return Response.json({ message: text })
  } catch (error) {
    console.error('[v0] Error in chat API:', error)
    return Response.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
