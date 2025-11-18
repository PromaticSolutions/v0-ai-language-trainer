import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Validações básicas
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'A senha deve ter no mínimo 6 caracteres' },
        { status: 400 }
      )
    }

    // Simulação de criação de conta (em produção, salvar no banco de dados)
    // Aqui você adicionaria a lógica para salvar no banco
    
    // Criar sessão automaticamente após registro
    const cookieStore = await cookies()
    cookieStore.set('user-session', JSON.stringify({ email, name, loggedIn: true }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })

    // Dar créditos iniciais ao novo usuário
    cookieStore.set('user-credits', '3', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Conta criada com sucesso! Você ganhou 3 créditos grátis.' 
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
