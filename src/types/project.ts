/**
 * 项目相关类型定义
 * Project Type Definitions
 */

// ============================================
// 技术栈相关类型
// ============================================

export type TechCategory = 'frontend' | 'backend' | 'devops' | 'ai' | 'engineering'

export interface TechStackCategory {
  category: TechCategory
  items: string[]
}

// ============================================
// 项目架构类型
// ============================================

export interface ProjectArchitecture {
  diagram: string // Mermaid 语法
  description: string
}

// ============================================
// 项目指标类型
// ============================================

export interface ProjectMetric {
  label: string
  value: string
  before?: string
  after?: string
  unit?: string
}

// ============================================
// 技术挑战类型
// ============================================

export interface TechnicalChallenge {
  title: string
  description: string
  solution: string
  technologies: string[]
}

// ============================================
// 项目详情类型
// ============================================

export interface ProjectDetail {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  coverImage: string
  gallery: string[]
  tags: string[]
  demoUrl?: string
  repoUrl?: string
  featured: boolean
  stars?: number
  forks?: number
  downloads?: string
  techStack: TechStackCategory[]
  architecture: ProjectArchitecture
  myRole: string
  contributions: string[]
  teamSize: number
  duration: string
  metrics: ProjectMetric[]
  challenges: TechnicalChallenge[]
}

// ============================================
// 项目列表项类型（简化版）
// ============================================

export interface ProjectListItem {
  id: string
  slug: string
  title: string
  summary: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  repoUrl?: string
  featured: boolean
  stars?: number
  forks?: number
}

// ============================================
// 组件 Props 类型
// ============================================

export interface ArchitectureDiagramProps {
  diagram: string
  className?: string
}

export interface MetricCardProps {
  label: string
  value: string
  before?: string
  after?: string
  unit?: string
  className?: string
}

export interface ChallengeCardProps {
  challenge: TechnicalChallenge
  index: number
  className?: string
}
