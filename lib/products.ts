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
    name: 'Pacote Inicial',
    description: '10 conversas para começar sua jornada',
    priceInCents: 1999, // R$ 19.99
    credits: 10,
  },
  {
    id: 'pro-pack',
    name: 'Pacote Pro',
    description: '30 conversas + bônus de 5 grátis',
    priceInCents: 4999, // R$ 49.99
    credits: 35,
    popular: true,
  },
  {
    id: 'unlimited-pack',
    name: 'Pacote Ilimitado',
    description: '100 conversas + bônus de 20 grátis',
    priceInCents: 14999, // R$ 149.99
    credits: 120,
  },
]
