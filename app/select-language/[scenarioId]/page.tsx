import { ArrowLeft, Globe, Sparkles } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

const scenarios: Record<string, any> = {
  "meeting-friend": {
    title: "Conhecendo Alguém",
    description: "Pratique apresentações e conversas casuais",
    image: "/two-friends-meeting-and-talking-casually.jpg",
  },
  restaurant: {
    title: "Restaurante",
    description: "Pratique fazer pedidos",
    image: "/traditional-japanese-restaurant.jpg",
  },
  "job-interview": {
    title: "Entrevista de Emprego",
    description: "Prepare-se para entrevistas profissionais",
    image: "/professional-office-interview.jpg",
  },
  airport: {
    title: "Aeroporto",
    description: "Navegue por aeroportos internacionais",
    image: "/modern-airport-terminal-with-passengers.jpg",
  },
  supermarket: {
    title: "Mercado",
    description: "Compre e pergunte sobre produtos",
    image: "/supermarket-interior-with-shopping-aisles.jpg",
  },
  "clothing-store": {
    title: "Loja de Roupa",
    description: "Experimente e compre roupas",
    image: "/modern-clothing-store-interior.jpg",
  },
  pharmacy: {
    title: "Farmácia",
    description: "Compre medicamentos e peça orientações",
    image: "/modern-medical-office.png",
  },
  office: {
    title: "Escritório de Empresa",
    description: "Interações profissionais no ambiente corporativo",
    image: "/modern-conference-room.png",
  },
}

const languages = [
  { id: "english", name: "Inglês", flag: "🇺🇸", code: "en-US" },
  { id: "spanish", name: "Espanhol", flag: "🇪🇸", code: "es-ES" },
  { id: "french", name: "Francês", flag: "🇫🇷", code: "fr-FR" },
]

export default async function SelectLanguagePage({ params }: { params: { scenarioId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: userProfile } = await supabase.from("users").select("credits").eq("id", user.id).single()

  const userCredits = userProfile?.credits || 0
  const scenario = scenarios[params.scenarioId]

  if (!scenario) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar ao Dashboard</span>
            </Link>
            <div className="px-3 md:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs md:text-sm font-medium">
                {userCredits} crédito{userCredits !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-border/40 shrink-0">
              <img
                src={scenario.image || "/placeholder.svg"}
                alt={scenario.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold mb-1 text-balance">{scenario.title}</h1>
              <p className="text-sm md:text-base text-muted-foreground">{scenario.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-5 w-5 shrink-0" />
            <p className="text-base md:text-lg">Escolha o idioma que deseja praticar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-3xl mx-auto">
          {languages.map((language) => (
            <Link key={language.id} href={`/practice/${params.scenarioId}?language=${language.id}`}>
              <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                <CardHeader className="text-center pb-3">
                  <div className="text-4xl md:text-5xl mb-3 group-hover:scale-110 transition-transform">
                    {language.flag}
                  </div>
                  <CardTitle className="text-lg md:text-xl">{language.name}</CardTitle>
                  <CardDescription className="text-xs">Código: {language.code}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full" variant="secondary" size="sm">
                    Praticar
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
