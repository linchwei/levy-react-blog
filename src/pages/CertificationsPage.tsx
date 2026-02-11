import { motion } from 'framer-motion'
import { Award, TrendingUp, BookOpen } from 'lucide-react'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { CertificationCard } from '@/components/certifications/CertificationCard'
import { SkillProgressList } from '@/components/certifications/SkillProgress'
import { certifications } from '@/components/certifications/certificationData'

export function CertificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              技能认证
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              持续学习，不断提升。展示获得的专业认证和技能水平。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Certifications Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-card rounded-xl p-6 border border-border mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">专业认证</h2>
                    <p className="text-sm text-muted-foreground">
                      {certifications.length} 个认证
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <CertificationCard certification={cert} />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Learning Resources */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold">持续学习</h2>
                </div>
                <p className="text-muted-foreground mb-4">
                  目前正在学习的新技术和计划获得的认证：
                </p>
                <div className="flex flex-wrap gap-2">
                  {['AWS Solutions Architect Professional', 'Kubernetes Administrator', 'TensorFlow Developer', 'Rust Programming'].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 bg-blue-500/10 text-blue-600 rounded-lg text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Skills Progress Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">技能水平</h2>
                    <p className="text-sm text-muted-foreground">
                      持续进步中
                    </p>
                  </div>
                </div>

                <SkillProgressList />

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-medium mb-3">图例说明</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">精通 (80%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-muted-foreground">熟练 (60-79%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">学习中</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
