import { NextResponse } from 'next/server'
import { deductCredit } from '@/lib/credits'

export async function POST() {
  try {
    const result = await deductCredit()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Insufficient credits' }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json({ 
      success: true, 
      remainingCredits: result.remainingCredits 
    })
  } catch (error) {
    console.error('[v0] Error deducting credit:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to deduct credit' }, 
      { status: 500 }
    )
  }
}
