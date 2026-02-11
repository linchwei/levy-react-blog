import { motion } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { GitHubStats } from '@/components/influence/GitHubStats'
import { PopularRepos } from '@/components/influence/PopularRepos'
import { SpeakingTimeline } from '@/components/influence/SpeakingTimeline'
import { Github, TrendingUp, Mic } from 'lucide-react'

// GitHub 用户名
const GITHUB_USERNAME = 'linchwei'

interface SectionTitleProps {
  icon: React.ReactNode
  title: string
  description?: string
}

function SectionTitle({ icon, title, description }: SectionTitleProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      {description && (
        <p className="text-muted-foreground ml-13">{description}</p>
      )}
    </div>
  )
}

export function InfluencePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              技术影响力
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              开源贡献、技术分享与社区参与，展示在技术领域的活跃度和影响力
            </p>
          </motion.div>

          {/* GitHub Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SectionTitle
              icon={<Github className="w-5 h-5 text-purple-500" />}
              title="GitHub 统计"
              description="开源项目贡献与社区活跃度"
            />
            <GitHubStats username={GITHUB_USERNAME} />
          </motion.section>

          {/* Popular Repos Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SectionTitle
              icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
              title="热门仓库"
              description="最受欢迎的开源项目"
            />
            <PopularRepos username={GITHUB_USERNAME} />
          </motion.section>

          {/* Speaking Timeline Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SectionTitle
              icon={<Mic className="w-5 h-5 text-purple-500" />}
              title="技术分享"
              description="演讲、工作坊与技术沙龙"
            />
            <SpeakingTimeline />
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
