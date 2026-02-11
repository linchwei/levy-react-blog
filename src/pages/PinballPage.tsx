import { motion } from 'framer-motion'
import { PinballGame } from '@/components/games/pinball/PinballGame'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Gamepad2, Target, Zap } from 'lucide-react'

export function PinballPage() {
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
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 mb-6">
                <Gamepad2 className="w-8 h-8 text-purple-500" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  弹球
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                经典弹球游戏，控制挡板反弹球体击碎砖块！
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
                <span>击碎砖块</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-5 h-5" />
                <span>关卡进阶</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Game Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <PinballGame />
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">游戏技巧</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold mb-2">控制角度</h3>
                <p className="text-sm text-muted-foreground">
                  球击中挡板不同位置会改变反弹角度
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold mb-2">优先击破</h3>
                <p className="text-sm text-muted-foreground">
                  优先击碎上方的砖块，获得更多分数
                </p>
              </div>
              <div className="p-6 rounded-xl bg-background border border-border/50">
                <div className="text-3xl mb-3">🛡️</div>
                <h3 className="font-semibold mb-2">保护生命</h3>
                <p className="text-sm text-muted-foreground">
                  不要让球掉落，合理利用三条生命
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
