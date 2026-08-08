import { Hero } from '@/components/home/Hero'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { TrustSection } from '@/components/home/TrustSection'

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <TrustSection />
    </>
  )
}

export default HomePage
