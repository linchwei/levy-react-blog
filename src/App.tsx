import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { PageLoader } from '@/components/common/LoadingSpinner'
import { PageProviders } from '@/providers/AppProviders'
import { GlobalParticleBackground } from '@/components/common/GlobalParticleBackground'
import { GlobalAIChat } from '@/components/common/GlobalAIChat'

// ============================================
// 懒加载页面组件
// Lazy-loaded page components
// ============================================
const HomePage = lazy(() =>
  import('@/pages/HomePage').then(m => ({ default: m.HomePage }))
)
const BlogListPage = lazy(() =>
  import('@/pages/BlogListPage').then(m => ({ default: m.BlogListPage }))
)
const BlogDetailPage = lazy(() => import('@/pages/BlogDetailPage'))
const TodoPage = lazy(() =>
  import('@/pages/TodoPage').then(m => ({ default: m.TodoPage }))
)
const TodoDetailPage = lazy(() =>
  import('@/pages/TodoDetailPage').then(m => ({ default: m.TodoDetailPage }))
)
const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then(m => ({ default: m.ProjectsPage }))
)
const ProjectDetailPage = lazy(() =>
  import('@/pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage }))
)
const AboutPage = lazy(() =>
  import('@/pages/AboutPage').then(m => ({ default: m.AboutPage }))
)
const TimelinePage = lazy(() =>
  import('@/pages/TimelinePage').then(m => ({ default: m.TimelinePage }))
)
const ToolsPage = lazy(() =>
  import('@/pages/ToolsPage').then(m => ({ default: m.ToolsPage }))
)
const CSSAnimationPage = lazy(() =>
  import('@/pages/CSSAnimationPage').then(m => ({
    default: m.CSSAnimationPage,
  }))
)
const AIAnimationPage = lazy(() =>
  import('@/pages/AIAnimationPage').then(m => ({ default: m.AIAnimationPage }))
)
const SVGAnimationPage = lazy(() =>
  import('@/pages/SVGAnimationPage').then(m => ({
    default: m.SVGAnimationPage,
  }))
)
const ScrollAnimationPage = lazy(() =>
  import('@/pages/ScrollAnimationPage').then(m => ({
    default: m.ScrollAnimationPage,
  }))
)
const CodePlaygroundPage = lazy(() =>
  import('@/pages/CodePlaygroundPage').then(m => ({
    default: m.CodePlaygroundPage,
  }))
)
const PerformanceDashboardPage = lazy(() =>
  import('@/pages/PerformanceDashboardPage').then(m => ({
    default: m.PerformanceDashboardPage,
  }))
)
const Scene3DBuilderPage = lazy(() =>
  import('@/pages/Scene3DBuilderPage').then(m => ({
    default: m.Scene3DBuilderPage,
  }))
)
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage }))
)
const InfluencePage = lazy(() =>
  import('@/pages/InfluencePage').then(m => ({ default: m.InfluencePage }))
)
const ResumePage = lazy(() =>
  import('@/pages/ResumePage').then(m => ({ default: m.ResumePage }))
)
const CertificationsPage = lazy(() =>
  import('@/pages/CertificationsPage').then(m => ({ default: m.CertificationsPage }))
)
const GalleryPage = lazy(() =>
  import('@/pages/GalleryPage').then(m => ({ default: m.GalleryPage }))
)

/**
 * 带 Suspense 的路由包装器
 * Route wrapper with Suspense
 */
function SuspenseRoute({ children }: { children: React.ReactNode }) {
  return (
    <PageProviders>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </PageProviders>
  )
}

/**
 * 主应用路由配置
 * Main Application Routes
 */
function App() {
  return (
    <>
      {/* Global Particle Background - Applied to all pages */}
      <GlobalParticleBackground />

      {/* Global AI Chat - Available on all pages */}
      <GlobalAIChat />

      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <SuspenseRoute>
              <HomePage />
            </SuspenseRoute>
          }
        />

        {/* Blog */}
        <Route
          path="/blog"
          element={
            <SuspenseRoute>
              <BlogListPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <SuspenseRoute>
              <BlogDetailPage />
            </SuspenseRoute>
          }
        />

        {/* Todo */}
        <Route
          path="/todo"
          element={
            <SuspenseRoute>
              <TodoPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/todo/:id"
          element={
            <SuspenseRoute>
              <TodoDetailPage />
            </SuspenseRoute>
          }
        />

        {/* Other Pages */}
        <Route
          path="/projects"
          element={
            <SuspenseRoute>
              <ProjectsPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <SuspenseRoute>
              <ProjectDetailPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/about"
          element={
            <SuspenseRoute>
              <AboutPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/timeline"
          element={
            <SuspenseRoute>
              <TimelinePage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools"
          element={
            <SuspenseRoute>
              <ToolsPage />
            </SuspenseRoute>
          }
        />

        {/* Tool Sub-pages */}
        <Route
          path="/tools/css-animation"
          element={
            <SuspenseRoute>
              <CSSAnimationPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools/ai-animation"
          element={
            <SuspenseRoute>
              <AIAnimationPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools/svg-animation"
          element={
            <SuspenseRoute>
              <SVGAnimationPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools/scroll-animation"
          element={
            <SuspenseRoute>
              <ScrollAnimationPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools/code-playground"
          element={
            <SuspenseRoute>
              <CodePlaygroundPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools/performance"
          element={
            <SuspenseRoute>
              <PerformanceDashboardPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/tools/3d-builder"
          element={
            <SuspenseRoute>
              <Scene3DBuilderPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SuspenseRoute>
              <DashboardPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/influence"
          element={
            <SuspenseRoute>
              <InfluencePage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/resume"
          element={
            <SuspenseRoute>
              <ResumePage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/certifications"
          element={
            <SuspenseRoute>
              <CertificationsPage />
            </SuspenseRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <SuspenseRoute>
              <GalleryPage />
            </SuspenseRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
