import { NextResponse } from "next/server"
import { trackMessage } from "@/lib/credits"

export async function POST() {
  try {
    const result = await trackMessage()

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "No credits available",
          remainingCredits: result.remainingCredits,
          messageCount: result.messageCount,
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      remainingCredits: result.remainingCredits,
      messageCount: result.messageCount,
      creditDeducted: result.creditDeducted,
    })
  } catch (error) {
    console.error("[v0] Error tracking message:", error)
    return NextResponse.json({ success: false, error: "Failed to track message" }, { status: 500 })
  }
}
