import { motion } from 'framer-motion'
import { Images } from 'lucide-react'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Gallery } from '@/components/gallery/Gallery'

export function GalleryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-purple-500/10 mb-6">
              <Images className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              作品集画廊
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              精选设计作品和项目截图，展示创意与技术实力。
            </p>
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Gallery />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
