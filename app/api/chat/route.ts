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
  } catch (error: any) {
    console.error("[v0] Error in chat API:", error?.message || error)

    if (error?.message?.includes("credit card") || error?.message?.includes("customer_verification_required")) {
      return Response.json(
        {
          error:
            "AI Gateway requer configuração. Por favor, adicione um cartão de crédito em vercel.com/account/billing para desbloquear seus créditos gratuitos.",
          errorType: "ai_gateway_config",
        },
        { status: 402 },
      )
    }

    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
