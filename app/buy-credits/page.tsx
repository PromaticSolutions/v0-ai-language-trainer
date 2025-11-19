'use client'

import { useState } from 'react'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Checkout from '@/components/checkout'
import { PRODUCTS } from '@/lib/products'

export default function BuyCreditsPage() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  if (selectedProductId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => setSelectedProductId(null)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos pacotes
          </Button>
          
          <div className="max-w-3xl mx-auto">
            <Checkout productId={selectedProductId} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 md:mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao dashboard</span>
            <span className="sm:hidden">Voltar</span>
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-balance">
              Escolha Seu Pacote de Créditos
            </h1>
            <p className="text-base md:text-xl text-muted-foreground text-balance px-4">
              Cada crédito permite uma conversa completa com nossos personagens de IA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {PRODUCTS.map((product) => (
              <Card
                key={product.id}
                className={`p-6 md:p-8 relative overflow-hidden transition-all hover:shadow-xl ${
                  product.popular ? 'border-primary border-2' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 md:px-4 py-1 text-xs md:text-sm font-semibold">
                    Mais Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-bold">
                      R$ {(product.priceInCents / 100).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-base md:text-lg">
                    <Sparkles className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-semibold">{product.credits} créditos</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  variant={product.popular ? 'default' : 'outline'}
                  onClick={() => setSelectedProductId(product.id)}
                >
                  Comprar Agora
                </Button>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Conversas ilimitadas por crédito</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Acesso a todos os cenários</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Créditos nunca expiram</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>Suporte a múltiplos idiomas</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 md:mt-12 text-center text-xs md:text-sm text-muted-foreground px-4">
            <p>Pagamento seguro processado pelo Stripe</p>
            <p className="mt-2">Dúvidas? Entre em contato conosco</p>
          </div>
        </div>
      </div>
    </div>
  )
}
