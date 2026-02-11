import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Code2,
  Palette,
  Zap,
  Globe,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: Code2,
    title: '技术博客',
    description:
      '深入解析前端技术，分享实战经验和最佳实践，涵盖 React、TypeScript、Node.js 等热门技术栈',
    color: 'from-blue-500 to-cyan-500',
    link: '/blog',
    stats: '50+ 篇文章',
  },
  {
    icon: Palette,
    title: '创意工具',
    description:
      '一站式开发工具集合，包括 CSS 动画库、代码游乐场、3D 场景构建器、性能分析仪表盘等',
    color: 'from-purple-500 to-pink-500',
    link: '/tools',
    stats: '7+ 个工具',
  },
  {
    icon: Zap,
    title: '开源项目',
    description: '积极参与开源社区，贡献代码和工具，推动前端生态发展',
    color: 'from-amber-500 to-orange-500',
    link: '/projects',
    stats: '20+ 个项目',
  },
  {
    icon: Globe,
    title: '技术视野',
    description:
      '关注前沿技术趋势，探索 WebAssembly、AI、WebGL 等新兴技术在 Web 开发中的应用',
    color: 'from-emerald-500 to-teal-500',
    link: '/timeline',
    stats: '持续学习',
  },
  {
    icon: Layers,
    title: '系统设计',
    description: '从架构设计到性能优化，提供完整的解决方案和实践经验分享',
    color: 'from-indigo-500 to-purple-500',
    link: '/blog',
    stats: '实战经验',
  },
  {
    icon: Sparkles,
    title: '创新实验',
    description: '不断尝试新技术和新想法，将创意转化为现实，打造独特的数字体验',
    color: 'from-rose-500 to-pink-500',
    link: '/tools/3d-builder',
    stats: '无限创意',
  },
]

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0]
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <Link to={feature.link}>
        <div className="relative h-full p-8 rounded-2xl bg-linear-to-br from-card/50 to-card border border-border/50 hover:border-purple-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/10 overflow-hidden">
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
          />

          {/* Icon */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`inline-flex p-4 rounded-2xl bg-linear-to-r ${feature.color} shadow-lg mb-6`}
          >
            <feature.icon className="w-8 h-8 text-white" />
          </motion.div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors">
            {feature.title}
          </h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {feature.description}
          </p>

          {/* Stats & Link */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
            <span className="text-sm font-medium text-purple-400">
              {feature.stats}
            </span>
            <motion.div
              className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors"
              whileHover={{ x: 5 }}
            >
              了解更多
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Hover decoration */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-linear-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        </div>
      </Link>
    </motion.div>
  )
}

export function FeaturesSection() {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' })

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/20 to-background pointer-events-none" />

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4"
          >
            <Sparkles className="w-4 h-4" />
            核心能力
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              我能为你做什么
            </span>
          </h2>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            专注于现代 Web 开发，提供从设计到实现的完整解决方案，
            <br className="hidden sm:block" />
            帮助你构建高性能、可扩展的数字产品
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
          >
            <span className="text-lg">了解更多关于我</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
