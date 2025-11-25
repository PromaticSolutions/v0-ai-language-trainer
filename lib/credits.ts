"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCredits(): Promise<{ credits: number; message_count: number }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { credits: 0, message_count: 0 }
  }

  const { data: userProfile } = await supabase.from("users").select("credits, message_count").eq("id", user.id).single()

  return {
    credits: userProfile?.credits || 0,
    message_count: userProfile?.message_count || 0,
  }
}

export async function addCredits(amount: number): Promise<number> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const { credits } = await getCredits()
  const newCredits = credits + amount

  await supabase.from("users").update({ credits: newCredits }).eq("id", user.id)

  return newCredits
}

export async function trackMessage(): Promise<{
  success: boolean
  remainingCredits: number
  messageCount: number
  creditDeducted: boolean
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, remainingCredits: 0, messageCount: 0, creditDeducted: false }
  }

  const { data: userProfile } = await supabase.from("users").select("credits, message_count").eq("id", user.id).single()

  if (!userProfile) {
    return { success: false, remainingCredits: 0, messageCount: 0, creditDeducted: false }
  }

  const currentCredits = userProfile.credits || 0
  const currentMessageCount = userProfile.message_count || 0

  // Check if user has credits
  if (currentCredits <= 0 && currentMessageCount >= 20) {
    return {
      success: false,
      remainingCredits: 0,
      messageCount: currentMessageCount,
      creditDeducted: false,
    }
  }

  const newMessageCount = currentMessageCount + 1
  let newCredits = currentCredits
  let creditDeducted = false

  // If reached 20 messages, deduct a credit and reset counter
  if (newMessageCount >= 20 && currentCredits > 0) {
    newCredits = currentCredits - 1
    creditDeducted = true

    await supabase
      .from("users")
      .update({
        credits: newCredits,
        message_count: 0, // Reset message count after deducting credit
      })
      .eq("id", user.id)

    return {
      success: true,
      remainingCredits: newCredits,
      messageCount: 0,
      creditDeducted: true,
    }
  } else {
    // Just increment message count
    await supabase.from("users").update({ message_count: newMessageCount }).eq("id", user.id)

    return {
      success: true,
      remainingCredits: newCredits,
      messageCount: newMessageCount,
      creditDeducted: false,
    }
  }
}

export async function deductCredit(): Promise<{ success: boolean; remainingCredits: number }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, remainingCredits: 0 }
  }

  const { credits } = await getCredits()

  if (credits <= 0) {
    return { success: false, remainingCredits: 0 }
  }

  const newCredits = credits - 1

  await supabase.from("users").update({ credits: newCredits }).eq("id", user.id)

  return { success: true, remainingCredits: newCredits }
}
