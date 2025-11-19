"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: "Teste Grátis",
    price: "R$ 0",
    description: "Experimente o poder da IA",
    features: [
      "3 créditos gratuitos",
      "Todos os cenários disponíveis",
      "Conversação ilimitada por crédito",
      "Feedback em tempo real",
      "Suporte a múltiplos idiomas"
    ],
    cta: "Começar Grátis",
    href: "/register",
    popular: false
  },
  {
    name: "Pacote Starter",
    price: "R$ 24,90",
    description: "Perfeito para começar sua jornada",
    features: [
      "20 créditos de conversação",
      "Todos os cenários",
      "Conversação ilimitada por crédito",
      "Feedback detalhado",
      "Suporte a múltiplos idiomas",
      "Créditos nunca expiram"
    ],
    cta: "Comprar Pacote",
    href: "/buy-credits",
    popular: false
  },
  {
    name: "Premium Ilimitado",
    price: "R$ 79,90",
    description: "Para os verdadeiros fluentes",
    features: [
      "120 créditos (100 + 20 bônus)",
      "Todos os cenários",
      "Conversação ilimitada por crédito",
      "Feedback avançado com gramática",
      "Suporte a múltiplos idiomas",
      "Créditos nunca expiram",
      "Melhor custo-benefício"
    ],
    cta: "Comprar Premium",
    href: "/buy-credits",
    popular: true
  }
]

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Comece de graça, cresça no seu ritmo
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Escolha o plano ideal para sua jornada de fluência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary border-2 shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">{plan.price}</span>
                </div>
                <CardDescription className="text-base mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
