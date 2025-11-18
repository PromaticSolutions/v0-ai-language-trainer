import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Simulação de autenticação (em produção, validar contra banco de dados)
    if (email && password) {
      // Criar sessão simples com cookie
      const cookieStore = await cookies()
      cookieStore.set('user-session', JSON.stringify({ email, loggedIn: true }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      })

      return NextResponse.json({ success: true, message: 'Login realizado com sucesso' })
    }

    return NextResponse.json(
      { success: false, message: 'Email ou senha inválidos' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao processar login' },
      { status: 500 }
    )
  }
}
