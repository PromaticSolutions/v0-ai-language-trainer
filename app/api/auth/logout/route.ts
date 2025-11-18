import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('user-session')
    
    return NextResponse.json({ success: true, message: 'Logout realizado com sucesso' })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao fazer logout' },
      { status: 500 }
    )
  }
}
