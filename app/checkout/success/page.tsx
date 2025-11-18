'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getCheckoutSessionStatus } from '@/app/actions/stripe'
import { addCredits } from '@/lib/credits'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [credits, setCredits] = useState(0)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setStatus('error')
      return
    }

    async function processCheckout() {
      try {
        const result = await getCheckoutSessionStatus(sessionId!)
        
        if (result.status === 'complete') {
          await addCredits(result.credits)
          setCredits(result.credits)
          setStatus('success')
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('[v0] Error processing checkout:', error)
        setStatus('error')
      }
    }

    processCheckout()
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg">Processando seu pagamento...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Erro no Pagamento</h1>
          <p className="text-muted-foreground mb-6">
            Houve um problema ao processar seu pagamento. Por favor, tente novamente.
          </p>
          <Button onClick={() => router.push('/buy-credits')}>
            Tentar Novamente
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Pagamento Confirmado!</h1>
        <p className="text-muted-foreground mb-2">
          Seus créditos foram adicionados com sucesso.
        </p>
        <p className="text-2xl font-bold text-primary mb-8">
          +{credits} créditos
        </p>
        <Button 
          onClick={() => router.push('/scenarios')}
          size="lg"
          className="w-full"
        >
          Começar a Praticar
        </Button>
      </Card>
    </div>
  )
}
