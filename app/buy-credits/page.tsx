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
      <div className="container mx-auto px-4 py-16">
        <Link href="/scenarios">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar aos cenários
          </Button>
        </Link>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Escolha Seu Pacote de Créditos
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Cada crédito permite uma conversa completa com nossos personagens de IA
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {PRODUCTS.map((product) => (
              <Card
                key={product.id}
                className={`p-8 relative overflow-hidden transition-all hover:shadow-xl ${
                  product.popular ? 'border-primary border-2' : ''
                }`}
              >
                {product.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-semibold">
                    Mais Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">
                      R$ {(product.priceInCents / 100).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-primary" />
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
                    <Check className="h-4 w-4 text-primary" />
                    <span>Conversas ilimitadas por crédito</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Acesso a todos os cenários</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Créditos nunca expiram</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Suporte a múltiplos idiomas</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center text-sm text-muted-foreground">
            <p>Pagamento seguro processado pelo Stripe</p>
            <p className="mt-2">Dúvidas? Entre em contato conosco</p>
          </div>
        </div>
      </div>
    </div>
  )
}
