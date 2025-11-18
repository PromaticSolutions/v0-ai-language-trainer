import { Hero } from "@/components/hero"
import { Scenarios } from "@/components/scenarios"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { CTA } from "@/components/cta"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Scenarios />
      <Features />
      <Pricing />
      <CTA />
    </main>
  )
}
