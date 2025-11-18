'use server'

import { cookies } from 'next/headers'

const CREDITS_COOKIE = 'fluency_credits'

export async function getCredits(): Promise<number> {
  const cookieStore = await cookies()
  const credits = cookieStore.get(CREDITS_COOKIE)
  return credits ? parseInt(credits.value, 10) : 3 // 3 free credits to start
}

export async function addCredits(amount: number): Promise<number> {
  const cookieStore = await cookies()
  const currentCredits = await getCredits()
  const newCredits = currentCredits + amount
  
  cookieStore.set(CREDITS_COOKIE, newCredits.toString(), {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  
  return newCredits
}

export async function deductCredit(): Promise<{ success: boolean; remainingCredits: number }> {
  const currentCredits = await getCredits()
  
  if (currentCredits <= 0) {
    return { success: false, remainingCredits: 0 }
  }
  
  const cookieStore = await cookies()
  const newCredits = currentCredits - 1
  
  cookieStore.set(CREDITS_COOKIE, newCredits.toString(), {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  
  return { success: true, remainingCredits: newCredits }
}
