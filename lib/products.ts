export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  credits: number
  popular?: boolean
}

// Source of truth for all credit packages
export const PRODUCTS: Product[] = [
  {
    id: 'starter-pack',
    name: 'Pacote Starter',
    description: '20 conversas para começar sua jornada',
    priceInCents: 2490, // R$ 24.90
    credits: 20,
  },
  {
    id: 'premium-pack',
    name: 'Premium Ilimitado',
    description: '100 conversas + bônus de 20 grátis',
    priceInCents: 7990, // R$ 79.90
    credits: 120,
    popular: true,
  },
]
