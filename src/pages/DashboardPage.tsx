import { motion } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { GitHubContributions } from '@/components/dashboard/GitHubContributions'
import { TechStackRadar } from '@/components/dashboard/TechStackRadar'
import { useBlogStore } from '@/stores/blogStore'
import { FileText, Eye, Heart } from 'lucide-react'

// 技能数据
const skillData = [
  { category: '前端技术', score: 95, fullMark: 100 },
  { category: '后端技术', score: 75, fullMark: 100 },
  { category: '工程化', score: 90, fullMark: 100 },
  { category: '架构设计', score: 85, fullMark: 100 },
  { category: 'AI/数据', score: 70, fullMark: 100 },
  { category: '团队协作', score: 88, fullMark: 100 },
]

// GitHub 用户名
const GITHUB_USERNAME = 'linchwei'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  delay?: number
}

function StatCard({ label, value, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="bg-card rounded-xl p-6 border border-border text-center"
    >
      <div className="text-4xl mb-2 text-purple-500">{icon}</div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </motion.div>
  )
}

export function DashboardPage() {
  const { posts } = useBlogStore()

  const stats = {
    totalPosts: posts.length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              数据仪表盘
            </h1>
            <p className="text-muted-foreground">
              用数据展示技术成长轨迹
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              label="总文章数"
              value={stats.totalPosts}
              icon={<FileText className="w-8 h-8 mx-auto" />}
              delay={0.1}
            />
            <StatCard
              label="总阅读量"
              value={stats.totalViews.toLocaleString()}
              icon={<Eye className="w-8 h-8 mx-auto" />}
              delay={0.2}
            />
            <StatCard
              label="总点赞数"
              value={stats.totalLikes.toLocaleString()}
              icon={<Heart className="w-8 h-8 mx-auto" />}
              delay={0.3}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GitHubContributions username={GITHUB_USERNAME} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TechStackRadar skills={skillData} />
            </motion.div>
          </div>


        </div>
      </main>

      <Footer />
    </div>
  )
}
