import { NextResponse } from 'next/server'
import { getCredits } from '@/lib/credits'

export async function GET() {
  try {
    const credits = await getCredits()
    return NextResponse.json({ credits })
  } catch (error) {
    console.error('[v0] Error fetching credits:', error)
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
  }
}
