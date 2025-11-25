import { generateText } from "ai"
import { trackMessage } from "@/lib/credits"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const trackResult = await trackMessage()

    if (!trackResult.success) {
      return Response.json(
        { error: "No credits available. Please purchase more credits to continue." },
        { status: 403 },
      )
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      messages,
      temperature: 0.7,
      maxTokens: 500,
    })

    return Response.json({
      message: text,
      remainingCredits: trackResult.remainingCredits,
      messageCount: trackResult.messageCount,
      creditDeducted: trackResult.creditDeducted,
    })
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
