"use client"

import { Button } from "@/components/ui/button"
import { Languages, Menu } from 'lucide-react'
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-lg bg-background/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Languages className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Fluency AI</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#scenarios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cenários
            </Link>
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:inline-flex">
              Entrar
            </Button>
            <Link href="/scenarios">
              <Button>
                Começar Grátis
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
