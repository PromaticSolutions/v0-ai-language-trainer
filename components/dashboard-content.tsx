"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, MessageSquare, TrendingUp, CreditCard, Menu, X, Trophy, Clock, Star } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const scenarios = [
  {
    id: "meeting-friend",
    name: "Conhecendo Alguém",
    language: "Multi-idioma",
    difficulty: "Iniciante",
    image: "/two-friends-meeting-and-talking-casually-in-a-cafe.jpg",
    icon: "👋",
    free: true, // Free plan access
  },
  {
    id: "restaurant",
    name: "Restaurante",
    language: "Multi-idioma",
    difficulty: "Iniciante",
    image: "/traditional-japanese-restaurant.jpg",
    icon: "🍽️",
    free: true, // Free plan access
  },
  {
    id: "job-interview",
    name: "Entrevista de Emprego",
    language: "Multi-idioma",
    difficulty: "Avançado",
    image: "/professional-office-interview.jpg",
    icon: "💼",
    free: false,
  },
  {
    id: "airport",
    name: "Aeroporto",
    language: "Multi-idioma",
    difficulty: "Intermediário",
    image: "/modern-airport-terminal-with-passengers.jpg",
    icon: "✈️",
    free: false,
  },
  {
    id: "supermarket",
    name: "Mercado",
    language: "Multi-idioma",
    difficulty: "Iniciante",
    image: "/supermarket-interior-with-shopping-aisles.jpg",
    icon: "🛒",
    free: false,
  },
  {
    id: "clothing-store",
    name: "Loja de Roupa",
    language: "Multi-idioma",
    difficulty: "Intermediário",
    image: "/modern-clothing-store-interior.jpg",
    icon: "👕",
    free: false,
  },
  {
    id: "pharmacy",
    name: "Farmácia",
    language: "Multi-idioma",
    difficulty: "Intermediário",
    image: "/modern-medical-office.png",
    icon: "💊",
    free: false,
  },
  {
    id: "office",
    name: "Escritório de Empresa",
    language: "Multi-idioma",
    difficulty: "Avançado",
    image: "/modern-conference-room.png",
    icon: "🏢",
    free: false,
  },
]

interface DashboardContentProps {
  user: any
  conversations: any[]
}

export function DashboardContent({ user, conversations }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("scenarios")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const stats = {
    totalConversations: conversations.length,
    totalMinutes: conversations.reduce((acc, conv) => acc + (conv.duration || 0), 0) / 60,
    credits: user?.credits || 0,
  }

  const isPaidUser = stats.credits > 3

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Fluency AI</h1>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <div className="flex pt-16 lg:pt-0">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky top-16 lg:top-0 left-0 bottom-0 z-40
          w-64 border-r border-border bg-background
          transition-transform duration-200 lg:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:h-screen overflow-y-auto
        `}
        >
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Olá, {user?.name || "Aluno"}!</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 text-sm">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="font-semibold">{stats.credits} créditos</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              <Button
                variant={activeTab === "scenarios" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("scenarios")
                  setMobileMenuOpen(false)
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Cenários
              </Button>
              <Button
                variant={activeTab === "history" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("history")
                  setMobileMenuOpen(false)
                }}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Histórico
              </Button>
              <Button
                variant={activeTab === "progress" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab("progress")
                  setMobileMenuOpen(false)
                }}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Progresso
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/buy-credits">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Comprar Créditos
                </Link>
              </Button>
            </nav>

            {/* Quick Stats */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Conversas</span>
                <span className="font-semibold">{stats.totalConversations}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Minutos praticados</span>
                <span className="font-semibold">{Math.round(stats.totalMinutes)}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === "scenarios" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Escolha seu Cenário</h1>
                <p className="text-muted-foreground">Pratique conversação em situações reais</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {scenarios.map((scenario) => {
                  const isLocked = !scenario.free && !isPaidUser

                  return (
                    <Card
                      key={scenario.id}
                      className={`overflow-hidden hover:shadow-lg transition-shadow ${
                        isLocked ? "opacity-60" : "cursor-pointer group"
                      }`}
                      onClick={() => !isLocked && router.push(`/select-language/${scenario.id}`)}
                    >
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                          src={scenario.image || "/placeholder.svg"}
                          alt={scenario.name}
                          className={`object-cover w-full h-full ${!isLocked && "group-hover:scale-105"} transition-transform duration-300`}
                        />
                        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center text-xl">
                          {scenario.icon}
                        </div>
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl mb-2">🔒</div>
                              <p className="text-xs text-white font-medium">Premium</p>
                            </div>
                          </div>
                        )}
                        {scenario.free && (
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">GRÁTIS</span>
                          </div>
                        )}
                      </div>
                      <CardHeader className="space-y-2">
                        <CardTitle className="text-lg">{scenario.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">{scenario.language}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-primary">{scenario.difficulty}</span>
                        </div>
                        {isLocked && (
                          <Button size="sm" variant="outline" asChild className="w-full mt-2 bg-transparent">
                            <Link href="/buy-credits">Desbloquear</Link>
                          </Button>
                        )}
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Histórico de Conversas</h1>
                <p className="text-muted-foreground">Reveja suas práticas anteriores</p>
              </div>

              {conversations.length === 0 ? (
                <Card className="p-8 md:p-12">
                  <div className="text-center space-y-4">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Nenhuma conversa ainda</h3>
                      <p className="text-muted-foreground mb-4">Comece sua primeira prática!</p>
                      <Button onClick={() => setActiveTab("scenarios")}>Explorar Cenários</Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {conversations.map((conv) => (
                    <Card key={conv.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base md:text-lg truncate">{conv.scenario_name}</CardTitle>
                            <CardDescription className="flex flex-wrap items-center gap-2 mt-2 text-xs md:text-sm">
                              <Clock className="w-3 h-3 md:w-4 md:h-4" />
                              {new Date(conv.created_at).toLocaleDateString("pt-BR")}
                              {conv.duration && (
                                <>
                                  <span>•</span>
                                  <span>{Math.round(conv.duration / 60)} min</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <Button size="sm" variant="outline" className="shrink-0 text-xs md:text-sm bg-transparent">
                            Ver detalhes
                          </Button>
                        </div>
                      </CardHeader>
                      {conv.feedback && (
                        <CardContent className="pt-0">
                          <div className="bg-muted/50 rounded-lg p-3 md:p-4">
                            <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{conv.feedback}</p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "progress" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Seu Progresso</h1>
                <p className="text-muted-foreground">Acompanhe sua evolução</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardDescription className="text-xs md:text-sm">Total de Conversas</CardDescription>
                    <CardTitle className="text-2xl md:text-3xl">{stats.totalConversations}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      <span>Continue praticando!</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardDescription className="text-xs md:text-sm">Tempo de Prática</CardDescription>
                    <CardTitle className="text-2xl md:text-3xl">{Math.round(stats.totalMinutes)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>minutos no total</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="space-y-0 pb-2">
                    <CardDescription className="text-xs md:text-sm">Créditos Restantes</CardDescription>
                    <CardTitle className="text-2xl md:text-3xl">{stats.credits}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" variant="outline" asChild className="w-full text-xs md:text-sm bg-transparent">
                      <Link href="/buy-credits">Comprar mais</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="p-6 md:p-8">
                <div className="text-center space-y-4">
                  <Star className="w-12 h-12 mx-auto text-yellow-500" />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Continue praticando!</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Quanto mais você pratica, mais fluente você fica
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
