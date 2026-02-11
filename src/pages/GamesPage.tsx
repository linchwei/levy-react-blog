import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Gamepad2, Trophy, Clock, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GameInfo {
  id: string
  name: string
  icon: string
  description: string
  path: string
  color: string
  gradient: string
  features: string[]
  difficulty: '简单' | '中等' | '困难'
}

const games: GameInfo[] = [
  {
    id: 'snake',
    name: '贪吃蛇',
    icon: '🐍',
    description: '经典街机游戏，控制蛇吃食物成长，不要撞墙或咬到自己！',
    path: '/games/snake',
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-500/10 to-emerald-500/10',
    features: ['速度可调', '计分系统', '最高分记录'],
    difficulty: '简单',
  },
  {
    id: 'tetris',
    name: '俄罗斯方块',
    icon: '🧱',
    description: '经典益智游戏，旋转和移动方块，填满整行消除得分！',
    path: '/games/tetris',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    features: ['7种方块', '等级系统', '无限关卡'],
    difficulty: '中等',
  },
  {
    id: '2048',
    name: '2048',
    icon: '🔢',
    description: '滑动数字方块，合并相同数字，挑战达到 2048！',
    path: '/games/2048',
    color: 'from-orange-500 to-amber-500',
    gradient: 'from-orange-500/10 to-amber-500/10',
    features: ['经典玩法', '动画效果', '获胜继续'],
    difficulty: '中等',
  },
  {
    id: 'memory',
    name: '记忆翻牌',
    icon: '🃏',
    description: '翻转卡片，找出相同的配对，挑战你的记忆力！',
    path: '/games/memory',
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/10 to-pink-500/10',
    features: ['三种难度', '计时挑战', '步数统计'],
    difficulty: '简单',
  },
  {
    id: 'breakout',
    name: '打砖块',
    icon: '🏓',
    description: '经典街机游戏，控制挡板反弹球，击碎所有砖块！',
    path: '/games/breakout',
    color: 'from-red-500 to-rose-500',
    gradient: 'from-red-500/10 to-rose-500/10',
    features: ['物理反弹', '多关卡', '生命系统'],
    difficulty: '困难',
  },
  {
    id: 'minesweeper',
    name: '扫雷',
    icon: '💣',
    description: '经典Windows游戏，通过逻辑推理找出所有隐藏的地雷！',
    path: '/games/minesweeper',
    color: 'from-gray-500 to-slate-500',
    gradient: 'from-gray-500/10 to-slate-500/10',
    features: ['三种难度', '逻辑推理', '最佳时间'],
    difficulty: '中等',
  },
  {
    id: 'gomoku',
    name: '五子棋',
    icon: '⚫⚪',
    description: '经典双人对弈游戏，先连成五子者获胜！支持人机对战和双人对战。',
    path: '/games/gomoku',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'from-amber-500/10 to-yellow-500/10',
    features: ['人人对战', '人机对战', '三种AI难度'],
    difficulty: '中等',
  },
  {
    id: 'aircraft',
    name: '飞机大战',
    icon: '✈️',
    description: '经典纵版射击游戏，控制战机消灭敌机，躲避子弹！',
    path: '/games/aircraft',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    features: ['道具系统', '关卡进阶', '炸弹清屏'],
    difficulty: '困难',
  },
  {
    id: 'klotski',
    name: '数字华容道',
    icon: '🧩',
    description: '经典益智游戏，将打乱的数字按顺序排列。考验你的逻辑思维！',
    path: '/games/klotski',
    color: 'from-emerald-500 to-teal-500',
    gradient: 'from-emerald-500/10 to-teal-500/10',
    features: ['三种难度', '计时挑战', '步数记录'],
    difficulty: '中等',
  },
  {
    id: 'pinball',
    name: '弹球',
    icon: '🏓',
    description: '经典弹球游戏，控制挡板反弹球体击碎砖块！',
    path: '/games/pinball',
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-500/10 to-pink-500/10',
    features: ['关卡进阶', '击碎砖块', '最高分记录'],
    difficulty: '简单',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function GamesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 pt-16"
      >
        {/* Hero Section */}
        <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-8 shadow-lg shadow-purple-500/20">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  游戏中心
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                精选5款经典小游戏，随时随地畅玩，挑战你的反应力和智慧！
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 flex flex-wrap justify-center gap-6"
            >
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-lg">
                  🐍
                </div>
                <span className="text-muted-foreground">贪吃蛇</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-lg">
                  🧱
                </div>
                <span className="text-muted-foreground">俄罗斯方块</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-lg">
                  🔢
                </div>
                <span className="text-muted-foreground">2048</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg">
                  🃏
                </div>
                <span className="text-muted-foreground">记忆翻牌</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-muted/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center text-lg">
                  🏓
                </div>
                <span className="text-muted-foreground">打砖块</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {games.map((game, index) => (
                <motion.div key={game.id} variants={itemVariants}>
                  <Link to={game.path}>
                    <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br hover:scale-[1.02]">
                      <CardContent
                        className={`p-0 bg-gradient-to-br ${game.gradient}`}
                      >
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                              {game.icon}
                            </div>
                            <Badge
                              variant="secondary"
                              className={`bg-gradient-to-r ${game.color} text-white border-0`}
                            >
                              {game.difficulty}
                            </Badge>
                          </div>

                          {/* Content */}
                          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {game.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {game.description}
                          </p>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {game.features.map((feature, i) => (
                              <span
                                key={i}
                                className="text-xs px-2 py-1 rounded-full bg-background/80 text-muted-foreground"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Play Button */}
                          <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                            <span>开始游戏</span>
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* Bottom Accent */}
                        <div
                          className={`h-1 bg-gradient-to-r ${game.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                        />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">游戏特色</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                所有游戏都经过精心设计，提供最佳的游戏体验
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              <motion.div variants={itemVariants} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">最高分记录</h3>
                <p className="text-sm text-muted-foreground">
                  自动保存你的最高分，挑战自我，不断突破
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">随时畅玩</h3>
                <p className="text-sm text-muted-foreground">
                  无需下载安装，打开浏览器即可立即开始游戏
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">经典玩法</h3>
                <p className="text-sm text-muted-foreground">
                  还原经典游戏规则，同时加入现代化的交互体验
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-border"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                选择你喜欢的游戏，开始你的挑战之旅！每一款游戏都能带给你不同的乐趣。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/games/snake"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all"
                >
                  <span>🐍</span>
                  从贪吃蛇开始
                </Link>
                <Link
                  to="/games/memory"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  <span>🃏</span>
                  试试记忆翻牌
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>

      <Footer />
    </div>
  )
}
