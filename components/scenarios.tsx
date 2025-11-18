"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, Briefcase, Heart, Plane, ShoppingBag, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const scenarios = [
  {
    icon: Coffee,
    title: "Café em Paris",
    description: "Pratique pedindo seu café favorito em uma cafeteria francesa",
    level: "Iniciante",
    language: "Francês",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    icon: Briefcase,
    title: "Entrevista de Emprego",
    description: "Prepare-se para entrevistas em inglês com confiança",
    level: "Intermediário",
    language: "Inglês",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    icon: Heart,
    title: "Conhecendo Alguém",
    description: "Aprenda a paquerar e fazer amigos em espanhol",
    level: "Iniciante",
    language: "Espanhol",
    color: "from-pink-500/20 to-rose-500/20"
  },
  {
    icon: Plane,
    title: "No Aeroporto",
    description: "Navegue pelo aeroporto e faça check-in sem stress",
    level: "Iniciante",
    language: "Inglês",
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    icon: ShoppingBag,
    title: "Fazendo Compras",
    description: "Pratique negociação e compras em lojas estrangeiras",
    level: "Intermediário",
    language: "Espanhol",
    color: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: Users,
    title: "Reunião de Negócios",
    description: "Conduza reuniões profissionais com fluência",
    level: "Avançado",
    language: "Inglês",
    color: "from-purple-500/20 to-indigo-500/20"
  }
]

export function Scenarios() {
  return (
    <section id="scenarios" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Escolha seu cenário
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Cada simulação é um RPG de conversação onde suas escolhas importam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario, index) => {
            const Icon = scenario.icon
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer hover:scale-105 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="secondary">{scenario.level}</Badge>
                  </div>
                  <CardTitle className="text-xl">{scenario.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{scenario.language}</Badge>
                    <span className="text-sm text-muted-foreground">5-10 min</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/scenarios">
            <Button size="lg" className="group">
              Ver Todos os Cenários
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
