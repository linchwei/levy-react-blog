import { motion } from 'framer-motion'
import { KlotskiGame } from '@/components/games/klotski/KlotskiGame'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Gamepad2, Brain, Target } from 'lucide-react'

export function KlotskiPage() {
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
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
                <Gamepad2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  数字华容道
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                经典益智游戏，将打乱的数字按顺序排列。考验你的逻辑思维和空间想象力！
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
                <Brain className="w-5 h-5" />
                <span>逻辑推理</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="w-5 h-5" />
                <span>三种难度</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Game Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <KlotskiGame />
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">游戏技巧</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">逐行排列</h3>
                <p className="text-sm text-muted-foreground">
                  先完成第一行，然后是第二行，依此类推
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">🧩</div>
                <h3 className="font-semibold mb-2">利用空格</h3>
                <p className="text-sm text-muted-foreground">
                  空格是移动的关键，合理规划移动路径
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">练习模式</h3>
                <p className="text-sm text-muted-foreground">
                  从3x3开始练习，逐步挑战更高难度
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
