import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Mail,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Zap,
  Globe,
  Sparkles,
} from 'lucide-react'

const highlights = [
  {
    icon: Code2,
    value: '50+',
    label: '技术文章',
    description: '分享前端与 AI 技术',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FolderGit2,
    value: '20+',
    label: '开源项目',
    description: 'GitHub 开源贡献',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    value: '100%',
    label: '交付质量',
    description: '客户满意度',
    color: 'from-amber-500 to-orange-500',
  },
]

const expertise = [
  { name: '前端工程化', level: '专家', color: 'bg-blue-500' },
  { name: 'React/Vue', level: '精通', color: 'bg-purple-500' },
  { name: 'AI 应用开发', level: '精通', color: 'bg-pink-500' },
  { name: '全栈开发', level: '熟练', color: 'bg-green-500' },
]

export function ProfileCard() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/30 to-background pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4"
          >
            <Briefcase className="w-4 h-4" />
            职业档案
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              关于我
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            一名热爱技术、追求极致的开发者
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="h-full bg-linear-to-br from-card/50 to-card border-border/50 overflow-hidden">
              <CardContent className="p-6">
                {/* Avatar & Name */}
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative inline-block mb-4"
                  >
                    <div className="w-24 h-24 rounded-full bg-linear-to-r from-purple-500 via-blue-500 to-cyan-500 p-1">
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                        <span className="text-3xl font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          LL
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-background" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-1">Levy Lin</h3>
                  <p className="text-sm text-muted-foreground">
                    高级前端工程师 / 全栈开发者
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>中国 · 远程工作</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-purple-400" />
                    <span>levy0802@qq.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <span>5+ 年开发经验</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <GraduationCap className="w-4 h-4 text-purple-400" />
                    <span>计算机科学背景</span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="space-y-2">
                  <p className="text-sm font-medium mb-3">专业领域</p>
                  {expertise.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-accent/50"
                    >
                      <span className="text-sm">{item.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full text-white ${item.color}`}
                      >
                        {item.level}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Stats & Bio */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Bio */}
            <Card className="bg-linear-to-br from-card/50 to-card border-border/50">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  个人简介
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  我是一名拥有 5
                  年以上经验的高级前端工程师，专注于构建高性能、可扩展的 Web
                  应用。精通 React、Vue、TypeScript
                  等现代前端技术栈，同时具备 Node.js、Python
                  后端开发能力。
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  近年来，我深入研究 AI
                  应用开发，熟练掌握大语言模型（LLM）的集成与应用，能够独立设计和实现基于
                  AI 的智能应用。我相信技术应该服务于产品，追求代码质量与用户体验的完美平衡。
                </p>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full bg-linear-to-br from-card/50 to-card border-border/50 hover:border-purple-500/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`p-2 rounded-lg bg-linear-to-r ${item.color}`}
                        >
                          <item.icon className="w-5 h-5 text-white" />
                        </motion.div>
                      </div>
                      <div className="text-3xl font-bold bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-1">
                        {item.value}
                      </div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* What I Do */}
            <Card className="bg-linear-to-br from-card/50 to-card border-border/50">
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  我能做什么
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: '前端开发',
                      desc: 'React/Vue 应用开发、组件库设计、性能优化',
                    },
                    {
                      title: '全栈开发',
                      desc: 'Node.js/Python 后端、数据库设计、API 开发',
                    },
                    {
                      title: 'AI 应用',
                      desc: 'LLM 集成、智能助手、自动化工作流',
                    },
                    {
                      title: '技术咨询',
                      desc: '架构设计、代码审查、团队培训',
                    },
                  ].map((service, index) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors"
                    >
                      <p className="font-medium text-sm">{service.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
