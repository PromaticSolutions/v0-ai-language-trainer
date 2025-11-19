"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Aprenda idiomas conversando com IA</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-balance max-w-4xl mx-auto leading-tight">
            Supere o medo de falar{" "}
            <span className="text-primary">outro idioma</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
            Pratique conversação em cenários reais com nossa IA. 
            Sem vergonha, sem julgamentos. Apenas você e sua fluência.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6 group w-full sm:w-auto">
                Começar Minha Simulação Gratuita
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto" onClick={() => {
              document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Ver Como Funciona
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>+10.000 conversas realizadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>3 idiomas disponíveis</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
