import { Mic, ArrowLeft, Lock, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCredits } from '@/lib/credits'

const scenarios = [
  {
    id: 'coffee-paris',
    title: 'Café em Paris',
    description: 'Pratique pedindo seu café favorito em uma cafeteria parisiense',
    language: 'Francês',
    difficulty: 'Iniciante',
    credits: 1,
    character: 'Marie - Barista',
    image: '/parisian-cafe-interior.jpg',
    unlocked: true,
  },
  {
    id: 'job-interview',
    title: 'Entrevista de Emprego',
    description: 'Prepare-se para entrevistas profissionais em inglês',
    language: 'Inglês',
    difficulty: 'Avançado',
    credits: 2,
    character: 'James - Recrutador',
    image: '/professional-office-interview.jpg',
    unlocked: true,
  },
  {
    id: 'hotel-checkin',
    title: 'Check-in no Hotel',
    description: 'Aprenda a fazer check-in em hotéis internacionais',
    language: 'Espanhol',
    difficulty: 'Intermediário',
    credits: 1,
    character: 'Carlos - Recepcionista',
    image: '/hotel-lobby-reception.jpg',
    unlocked: true,
  },
  {
    id: 'restaurant-tokyo',
    title: 'Restaurante em Tokyo',
    description: 'Pratique fazer pedidos em um restaurante japonês',
    language: 'Japonês',
    difficulty: 'Intermediário',
    credits: 2,
    character: 'Yuki - Garçonete',
    image: '/traditional-japanese-restaurant.jpg',
    unlocked: false,
  },
  {
    id: 'doctor-appointment',
    title: 'Consulta Médica',
    description: 'Descreva sintomas e entenda orientações médicas',
    language: 'Inglês',
    difficulty: 'Intermediário',
    credits: 1,
    character: 'Dr. Smith - Médico',
    image: '/modern-medical-office.png',
    unlocked: false,
  },
  {
    id: 'business-meeting',
    title: 'Reunião de Negócios',
    description: 'Conduza reuniões profissionais com confiança',
    language: 'Inglês',
    difficulty: 'Avançado',
    credits: 3,
    character: 'Anna - Executiva',
    image: '/modern-conference-room.png',
    unlocked: false,
  },
]

const difficultyColors = {
  Iniciante: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediário: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Avançado: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default async function ScenariosPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('credits')
    .eq('id', user.id)
    .single()

  const userCredits = userProfile?.credits || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="px-3 md:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs md:text-sm font-medium">{userCredits} crédito{userCredits !== 1 ? 's' : ''}</span>
              </div>
              <Link href="/buy-credits">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">
                  <span className="hidden sm:inline">Comprar</span>
                  <span className="sm:hidden">+</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4 text-balance">
            Escolha Seu Cenário
          </h1>
          <p className="text-base md:text-xl text-muted-foreground text-balance">
            Pratique conversação em situações do dia a dia
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="group relative rounded-xl border border-border/40 bg-card overflow-hidden hover:border-primary/50 transition-all duration-300"
            >
              {!scenario.unlocked && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Bloqueado</p>
                  </div>
                </div>
              )}

              <div className="relative h-48 overflow-hidden">
                <img
                  src={scenario.image || "/placeholder.svg"}
                  alt={scenario.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    {scenario.credits} crédito{scenario.credits > 1 ? 's' : ''}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-xl font-semibold mb-1">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {scenario.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Mic className="h-3 w-3" />
                    <span>{scenario.character}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {scenario.language}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${difficultyColors[scenario.difficulty as keyof typeof difficultyColors]}`}
                  >
                    {scenario.difficulty}
                  </Badge>
                </div>

                {scenario.unlocked ? (
                  <Link href={`/practice/${scenario.id}`} className="block">
                    <Button className="w-full" size="sm">
                      Começar Prática
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" size="sm" variant="outline" disabled>
                    Em Breve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
