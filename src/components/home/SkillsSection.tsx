import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import {
  Cpu,
  Layers,
  Sparkles,
  Wrench,
  Database,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

const skillCategories = [
  {
    id: 'frontend',
    title: '前端专家',
    icon: Layers,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-500/5 to-cyan-500/5',
    description: '深耕现代前端技术栈，精通组件化开发与性能优化',
    skills: [
      { name: 'React / Next.js', level: 95, status: '精通' },
      { name: 'TypeScript', level: 92, status: '精通' },
      { name: 'Vue.js / Nuxt', level: 88, status: '精通' },
      { name: 'Tailwind CSS', level: 90, status: '精通' },
    ],
    highlights: ['Fiber 架构原理', 'Hooks 深度实践', 'SSR/SSG 优化'],
  },
  {
    id: 'backend',
    title: '后端能力',
    icon: Database,
    color: 'from-green-500 to-emerald-500',
    bgColor: 'from-green-500/5 to-emerald-500/5',
    description: '具备全栈开发能力，熟悉服务端架构与数据库设计',
    skills: [
      { name: 'Node.js / Express', level: 85, status: '熟练' },
      { name: 'Python / FastAPI', level: 80, status: '熟练' },
      { name: 'PostgreSQL / Redis', level: 78, status: '熟练' },
      { name: 'Docker / K8s', level: 75, status: '了解' },
    ],
    highlights: ['微服务架构', 'RESTful API 设计', '数据库优化'],
  },
  {
    id: 'ai',
    title: 'AI 应用',
    icon: Sparkles,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-500/5 to-rose-500/5',
    description: '专注大语言模型应用开发，探索 AI 落地场景',
    skills: [
      { name: 'LLM / Prompt Engineering', level: 85, status: '精通' },
      { name: 'LangChain / LlamaIndex', level: 80, status: '熟练' },
      { name: 'TensorFlow / PyTorch', level: 70, status: '了解' },
      { name: 'RAG / Agent 设计', level: 82, status: '熟练' },
    ],
    highlights: ['智能助手开发', 'RAG 系统构建', 'AI 工作流设计'],
  },
  {
    id: 'engineering',
    title: '工程化',
    icon: Wrench,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'from-amber-500/5 to-orange-500/5',
    description: '注重代码质量与工程实践，追求高效开发流程',
    skills: [
      { name: 'Git / CI/CD', level: 90, status: '精通' },
      { name: 'Testing (Jest/Cypress)', level: 82, status: '熟练' },
      { name: 'Performance', level: 88, status: '精通' },
      { name: 'AWS / 阿里云', level: 72, status: '了解' },
    ],
    highlights: ['自动化测试', '性能优化', 'DevOps 实践'],
  },
]

const learningNow = [
  { name: 'WebAssembly', progress: 60 },
  { name: 'Rust', progress: 45 },
  { name: 'Three.js', progress: 70 },
]

export function SkillsSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-muted/30 to-background pointer-events-none" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-40 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

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
            <Cpu className="w-4 h-4" />
            技术能力
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              专业领域
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            多年积累的技术栈，覆盖前端、后端、AI 等多个领域
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {skillCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full bg-linear-to-br ${category.bgColor} border-border/50 hover:border-purple-500/30 transition-colors`}>
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-xl bg-linear-to-r ${category.color} shadow-lg`}
                    >
                      <category.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-4 mb-6">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + skillIndex * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {skill.level}%
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full text-white ${
                                skill.status === '精通'
                                  ? 'bg-purple-500'
                                  : skill.status === '熟练'
                                  ? 'bg-blue-500'
                                  : 'bg-green-500'
                              }`}
                            >
                              {skill.status}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-accent rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 1,
                              delay: 0.3 + skillIndex * 0.1,
                              ease: 'easeOut',
                            }}
                            className={`h-full bg-linear-to-r ${category.color} rounded-full`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {category.highlights.map((highlight, i) => (
                      <motion.span
                        key={highlight}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-accent/80 text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {highlight}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Learning Now */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-linear-to-br from-card/50 to-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-pink-500"
                >
                  <TrendingUp className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold">持续学习</h3>
                  <p className="text-sm text-muted-foreground">
                    技术日新月异，保持学习的热情
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {learningNow.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 rounded-xl bg-accent/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
