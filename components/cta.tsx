"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-96 bg-primary/30 rounded-full blur-3xl opacity-30 pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center space-y-8 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12">
          <h2 className="text-4xl md:text-5xl font-bold text-balance">
            Pronto para falar com confiança?
          </h2>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de brasileiros que já superaram o medo de falar outro idioma.
            Sua primeira simulação é grátis!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 group">
              Começar Minha Jornada Agora
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Sem cartão de crédito • Cancele quando quiser • Garantia de 7 dias
          </p>
        </div>
      </div>
    </section>
  )
}
