import { motion } from 'framer-motion'
import { TrendingProjects } from '@/components/trending/TrendingProjects'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'

export function TrendingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 pt-16"
      >
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-orange-500/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                  Trending
                </span>
                <span className="text-foreground"> Projects</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                探索 GitHub 上最热门的开源项目，紧跟技术潮流，发现下一个改变世界的代码
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { label: 'Languages', value: '7+' },
                { label: 'Projects', value: '100M+' },
                { label: 'Developers', value: '100M+' },
                { label: 'Daily Updates', value: 'Real-time' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trending Projects Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <TrendingProjects />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">为什么选择开源？</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                开源项目代表了技术社区最前沿的创新，参与开源是成为优秀开发者的必经之路
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: '学习最佳实践',
                  description:
                    '阅读优秀开源项目的代码，学习行业顶尖开发者的设计思路和编码规范',
                  icon: '📚',
                },
                {
                  title: '参与社区贡献',
                  description:
                    '通过提交 Issue 和 PR 参与项目开发，与全球开发者协作交流',
                  icon: '🤝',
                },
                {
                  title: '构建个人品牌',
                  description:
                    '开源贡献是展示技术实力的最佳方式，助力职业发展和个人品牌建设',
                  icon: '🚀',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-background border border-border/50 hover:border-primary/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
