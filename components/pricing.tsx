"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Teste Grátis",
    price: "R$ 0",
    description: "Experimente o poder da IA",
    features: [
      "3 créditos gratuitos (60 mensagens)",
      "2 cenários disponíveis",
      "3 idiomas (Inglês, Francês, Espanhol)",
      "Feedback em tempo real",
      "20 mensagens por crédito",
    ],
    cta: "Começar Grátis",
    href: "/register",
    popular: false,
  },
  {
    name: "Pacote Starter",
    price: "R$ 24,90",
    description: "Perfeito para começar sua jornada",
    features: [
      "20 créditos (400 mensagens totais)",
      "Todos os 8 cenários",
      "3 idiomas disponíveis",
      "Feedback detalhado",
      "20 mensagens por crédito",
      "Créditos nunca expiram",
    ],
    cta: "Comprar Pacote",
    href: "/buy-credits",
    popular: false,
  },
  {
    name: "Premium Ilimitado",
    price: "R$ 79,90",
    description: "Para os verdadeiros fluentes",
    features: [
      "120 créditos (2.400 mensagens totais)",
      "Todos os 8 cenários",
      "3 idiomas disponíveis",
      "Feedback avançado com gramática",
      "20 mensagens por crédito",
      "Créditos nunca expiram",
      "Melhor custo-benefício",
    ],
    cta: "Comprar Premium",
    href: "/buy-credits",
    popular: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
            Comece de graça, cresça no seu ritmo
          </h2>
          <p className="text-base md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto px-4">
            Escolha o plano ideal para sua jornada de fluência
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-6 max-w-sm md:max-w-none mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary border-2 shadow-lg md:scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-xs md:text-sm">Mais Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-6 md:pb-8 pt-6 md:pt-6">
                <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                <div className="mt-3 md:mt-4">
                  <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                </div>
                <CardDescription className="text-sm md:text-base mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-4 md:px-6">
                <ul className="space-y-2.5 md:space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2.5 md:gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="px-4 md:px-6 pb-6">
                <Link href={plan.href} className="w-full">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
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
