import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('user-session')
    
    if (session) {
      const userData = JSON.parse(session.value)
      return NextResponse.json({ 
        success: true, 
        user: userData 
      })
    }
    
    return NextResponse.json(
      { success: false, message: 'Não autenticado' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao verificar sessão' },
      { status: 500 }
    )
  }
}
