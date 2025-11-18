"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mic, Brain, MessageSquare, TrendingUp, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Mic,
    title: "Reconhecimento de Voz em Tempo Real",
    description: "Nossa IA escuta e entende sua pronúncia com precisão impressionante"
  },
  {
    icon: Brain,
    title: "IA Adaptativa",
    description: "Se adapta ao seu nível e velocidade de aprendizado automaticamente"
  },
  {
    icon: MessageSquare,
    title: "Conversação Natural",
    description: "Diálogos realistas que simulam situações do dia a dia"
  },
  {
    icon: TrendingUp,
    title: "Feedback Instantâneo",
    description: "Receba correções e sugestões em tempo real durante a conversa"
  },
  {
    icon: Shield,
    title: "Ambiente Seguro",
    description: "Pratique sem medo de errar ou ser julgado. É só você e a IA"
  },
  {
    icon: Zap,
    title: "Progresso Rápido",
    description: "Veja sua fluência melhorar a cada sessão com métricas claras"
  }
]

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Como funciona a magia
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Tecnologia de ponta para transformar sua forma de aprender idiomas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
