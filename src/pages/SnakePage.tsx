import { motion } from 'framer-motion'
import { SnakeGame } from '@/components/games/snake/SnakeGame'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Gamepad2, Trophy, Target } from 'lucide-react'

export function SnakePage() {
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
        <section className="relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-green-500/5 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
                <Gamepad2 className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  贪吃蛇
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                经典街机游戏，控制蛇吃食物成长，不要撞墙或咬到自己！
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex justify-center gap-8"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-5 h-5" />
                <span>目标：尽可能高分</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Trophy className="w-5 h-5" />
                <span>记录保存在本地</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Game Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SnakeGame />
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">游戏技巧</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">规划路线</h3>
                <p className="text-sm text-muted-foreground">
                  提前规划好移动路线，避免把自己逼入死角
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">控制速度</h3>
                <p className="text-sm text-muted-foreground">
                  随着分数增加速度会变快，保持冷静专注
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">🍎</div>
                <h3 className="font-semibold mb-2">特殊食物</h3>
                <p className="text-sm text-muted-foreground">
                  金色食物价值20分，出现时优先获取
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>

      <Footer />
    </div>
  )
}
