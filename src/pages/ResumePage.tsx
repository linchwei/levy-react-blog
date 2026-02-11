import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Printer, LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { ResumeEditor } from '@/components/resume/ResumeEditor'
import { ModernTemplate } from '@/components/resume/ModernTemplate'
import { QRCodeButton } from '@/components/resume/QRCodeButton'
import { useResumeStore } from '@/stores/resumeStore'

export function ResumePage() {
  const { data, setData } = useResumeStore()
  const previewRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              在线简历生成器
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              编辑左侧表单，右侧实时预览。完成后可打印或分享二维码。
            </p>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-card rounded-xl border border-border"
          >
            <div className="flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-purple-500" />
              <span className="font-medium">现代模板</span>
            </div>
            <div className="flex items-center gap-3">
              <QRCodeButton />
              <Button variant="outline" onClick={handlePrint} className="gap-2">
                <Printer className="w-4 h-4" />
                打印 / 另存为PDF
              </Button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="print:hidden"
            >
              <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                <ResumeEditor data={data} onChange={setData} />
              </div>
            </motion.div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              ref={previewRef}
              className="bg-muted rounded-xl p-4 print:p-0 print:bg-white"
            >
              <div className="sticky top-24">
                <div className="text-sm text-muted-foreground mb-2 print:hidden">
                  预览效果
                </div>
                <div className="overflow-auto print:overflow-visible">
                  <ModernTemplate data={data} />
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
