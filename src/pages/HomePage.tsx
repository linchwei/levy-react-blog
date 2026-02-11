import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { HeroSection } from '@/components/home/HeroSection'
import { ProfileCard } from '@/components/home/ProfileCard'
import { SkillsSection } from '@/components/home/SkillsSection'
import { BentoGrid } from '@/components/home/BentoGrid'
import { LatestArticles } from '@/components/home/LatestArticles'
import { Footer } from '@/components/home/Footer'
import { useBlogStore } from '@/stores/blogStore'

export function HomePage() {
  const { fetchData, isLoading, error } = useBlogStore()

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-6xl mb-4"
          >
            ⚠️
          </motion.div>
          <p className="text-red-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchData()}
            className="px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium shadow-lg shadow-purple-500/25"
          >
            重试
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <ProfileCard />
        <SkillsSection />
        <BentoGrid />
        <LatestArticles />
      </main>
      <Footer />
    </div>
  )
}
