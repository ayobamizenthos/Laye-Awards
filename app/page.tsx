import { Hero } from '@/components/home/Hero'
import { Stats } from '@/components/home/Stats'
import { Categories } from '@/components/home/Categories'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Experience } from '@/components/home/Experience'
import { HallOfFame } from '@/components/home/HallOfFame'
import { SponsorshipHome } from '@/components/home/SponsorshipHome'
import { CTABanner } from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Categories />
      <HowItWorks />
      <Experience />
      <HallOfFame />
      <SponsorshipHome />
      <CTABanner />
    </>
  )
}
