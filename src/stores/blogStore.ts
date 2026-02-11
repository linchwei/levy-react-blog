import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  publishedAt: Date
  updatedAt: Date
  readingTime: number
  views: number
  likes: number
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  repoUrl?: string
  featured: boolean
}

export interface Skill {
  name: string
  level: number
  category:
    | 'frontend'
    | 'backend'
    | 'design'
    | 'tools'
    | 'ai'
    | 'devops'
    | 'product'
  icon: string
  description?: string
}

export interface TimelineEvent {
  id: string
  date: Date
  title: string
  description: string
  type: 'work' | 'education' | 'project' | 'award'
  company?: string
  location?: string
  highlights?: string[]
  icon?: string
  tech?: string[]
  metrics?: { label: string; value: string }[]
}

// JSON 数据类型（日期为字符串）
interface BlogPostJSON extends Omit<BlogPost, 'publishedAt' | 'updatedAt'> {
  publishedAt: string
  updatedAt: string
}

interface TimelineEventJSON extends Omit<TimelineEvent, 'date'> {
  date: string
}

interface BlogState {
  posts: BlogPost[]
  projects: Project[]
  skills: Skill[]
  timeline: TimelineEvent[]
  selectedCategory: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null

  // Actions
  setSelectedCategory: (category: string | null) => void
  setSearchQuery: (query: string) => void
  incrementViews: (postId: string) => void
  incrementLikes: (postId: string) => void
  fetchData: () => Promise<void>

  // Getters
  getFilteredPosts: () => BlogPost[]
  getFeaturedPosts: () => BlogPost[]
  getPostBySlug: (slug: string) => BlogPost | undefined
  getFeaturedProjects: () => Project[]
  getSkillsByCategory: (category: Skill['category']) => Skill[]
}

// 转换日期字符串为 Date 对象
const parsePostDates = (post: BlogPostJSON): BlogPost => ({
  ...post,
  publishedAt: new Date(post.publishedAt),
  updatedAt: new Date(post.updatedAt),
})

const parseTimelineDates = (event: TimelineEventJSON): TimelineEvent => ({
  ...event,
  date: new Date(event.date),
})

export const useBlogStore = create<BlogState>()(
  persist(
    (set, get) => ({
      posts: [],
      projects: [],
      skills: [],
      timeline: [],
      selectedCategory: null,
      searchQuery: '',
      isLoading: false,
      error: null,

      setSelectedCategory: category => set({ selectedCategory: category }),
      setSearchQuery: query => set({ searchQuery: query }),

      incrementViews: postId => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, views: post.views + 1 } : post
          ),
        }))
      },

      incrementLikes: postId => {
        set(state => ({
          posts: state.posts.map(post =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          ),
        }))
      },

      fetchData: async () => {
        set({ isLoading: true, error: null })
        try {
          // 如果文章少于 10 篇，重新获取数据
          const currentState = get()
          console.log('Current posts count:', currentState.posts.length)
          if (currentState.posts.length >= 10) {
            console.log('Posts already loaded, skipping fetch')
            set({ isLoading: false })
            return
          }

          // 从 posts.json 文件加载文章数据（使用相对路径）
          const baseUrl = import.meta.env.BASE_URL || '/'
          const url = `${baseUrl}posts.json`
          console.log('Fetching posts from:', url)
          const response = await fetch(url)
          console.log('Response status:', response.status)
          if (!response.ok) {
            throw new Error(`Failed to fetch posts: ${response.status}`)
          }
          const postsData: BlogPostJSON[] = await response.json()
          console.log('Fetched posts count:', postsData.length)

          // 专业履历数据 - 大厂背景
          const mockTimelineData: TimelineEventJSON[] = [
            {
              id: '1',
              date: '2024-03-01',
              title: '高级前端技术专家',
              company: '字节跳动',
              location: '北京',
              description:
                '负责抖音电商核心交易系统前端架构设计与优化，主导微前端架构升级，支撑日均亿级流量。带领15人前端团队，建立完整的前端工程化体系和技术规范。',
              highlights: [
                '设计并实现微前端架构，支撑50+子应用独立部署，发布效率提升300%',
                '优化首屏加载性能，FCP从2.1s降至0.8s，转化率提升12%',
                '构建前端监控体系，实现99.99%的页面稳定性',
                '主导低代码平台建设，业务交付效率提升40%',
                '培养3名高级前端工程师，团队技术能力显著提升',
              ],
              type: 'work',
              icon: 'rocket',
              tech: [
                'React',
                'TypeScript',
                'Micro-Frontend',
                'Webpack',
                'Node.js',
                'Rust',
              ],
              metrics: [
                { label: '团队规模', value: '15人' },
                { label: '日活用户', value: '1亿+' },
                { label: '性能提升', value: '60%' },
                { label: '代码覆盖率', value: '92%' },
              ],
            },
            {
              id: '2',
              date: '2022-06-01',
              title: '前端架构师',
              company: '阿里巴巴',
              location: '杭州',
              description:
                '加入淘宝核心交易团队，负责购物车、订单确认等核心链路前端开发。主导前端性能优化专项，推动团队技术升级至React 18 + TypeScript全栈方案。',
              highlights: [
                '重构购物车模块，代码量减少40%，维护成本降低60%',
                '实现服务端渲染(SSR)方案，SEO评分从65提升至95',
                '设计通用组件库，被5个业务线复用，节省开发成本200+人日',
                '建立前端性能监控体系，首屏时间P99从3s降至1.2s',
                '获得2023年度优秀技术个人奖',
              ],
              type: 'work',
              icon: 'briefcase',
              tech: [
                'React',
                'Next.js',
                'TypeScript',
                'GraphQL',
                'Docker',
                'Kubernetes',
              ],
              metrics: [
                { label: '代码重构', value: '40%' },
                { label: '性能提升', value: '70%' },
                { label: '组件复用', value: '5个团队' },
                { label: '用户满意度', value: '4.9/5' },
              ],
            },
            {
              id: '3',
              date: '2020-04-01',
              title: '高级前端工程师',
              company: '腾讯',
              location: '深圳',
              description:
                '参与微信读书Web端开发，负责阅读器核心功能实现。优化大文档渲染性能，解决长列表卡顿问题，提升用户阅读体验。',
              highlights: [
                '实现虚拟滚动方案，支持百万字文档流畅阅读',
                '开发富文本编辑器，支持复杂排版和多媒体插入',
                '优化内存管理，解决长时间阅读内存泄漏问题',
                '设计离线阅读方案，支持无网络环境下正常阅读',
                '获得2021年腾讯技术突破奖',
              ],
              type: 'work',
              icon: 'code',
              tech: ['Vue.js', 'Electron', 'Canvas', 'WebGL', 'IndexedDB'],
              metrics: [
                { label: '文档大小', value: '100万字+' },
                { label: '内存优化', value: '80%' },
                { label: '用户留存', value: '85%' },
                { label: '日活增长', value: '200%' },
              ],
            },
            {
              id: '4',
              date: '2018-07-01',
              title: '前端开发工程师',
              company: '美团',
              location: '北京',
              description:
                '加入美团外卖前端团队，负责商家端管理系统开发。从0到1搭建前端工程化体系，推动团队从jQuery向Vue.js技术栈迁移。',
              highlights: [
                '完成前端技术栈升级，开发效率提升50%',
                '搭建前端CI/CD流水线，实现自动化测试和部署',
                '开发可视化数据平台，支撑业务数据分析需求',
                '编写技术文档和培训材料，帮助团队快速上手新技术',
                '获得2019年美团技术新人奖',
              ],
              type: 'work',
              icon: 'terminal',
              tech: ['Vue.js', 'Webpack', 'Node.js', 'MongoDB', 'Redis'],
              metrics: [
                { label: '效率提升', value: '50%' },
                { label: '代码质量', value: 'A级' },
                { label: '培训人数', value: '20+' },
                { label: '系统稳定性', value: '99.9%' },
              ],
            },
            {
              id: '5',
              date: '2016-09-01',
              title: '计算机科学与技术',
              company: '浙江大学',
              location: '杭州',
              description:
                '985高校计算机专业，GPA 3.9/4.0，专业排名前5%。主修课程：数据结构与算法、操作系统、计算机网络、数据库系统、软件工程。',
              highlights: [
                '获得国家奖学金（专业前1%）',
                'ACM程序设计竞赛区域赛银牌',
                '发表CCF-B类论文1篇',
                '担任校计算机协会副会长，组织技术分享活动20+场',
                '毕业设计获得优秀毕业论文奖',
              ],
              type: 'education',
              icon: 'graduation',
              tech: ['C++', 'Java', 'Python', 'Algorithm', 'System Design'],
              metrics: [
                { label: 'GPA', value: '3.9/4.0' },
                { label: '专业排名', value: '前5%' },
                { label: '论文发表', value: '1篇' },
                { label: '竞赛奖项', value: '银牌' },
              ],
            },
            {
              id: '6',
              date: '2023-08-01',
              title: 'React-Virtual-Pro',
              description:
                '高性能React虚拟列表组件库，支持百万级数据流畅渲染。GitHub Star 5.2k+，npm周下载量10万+，被多家大厂采用。',
              highlights: [
                '支持动态高度、横向滚动、无限加载等高级特性',
                '性能优化到极致，滚动帧率稳定在60fps',
                '完善的TypeScript类型支持',
                '详细的文档和示例，降低使用门槛',
                '活跃维护，响应社区反馈，月均发布2-3个版本',
              ],
              type: 'project',
              icon: 'github',
              tech: ['React', 'TypeScript', 'Rollup', 'Jest', 'GitHub Actions'],
              metrics: [
                { label: 'GitHub Stars', value: '5.2k' },
                { label: '周下载量', value: '10万+' },
                { label: '贡献者', value: '25+' },
                { label: 'Issues解决率', value: '98%' },
              ],
            },
            {
              id: '7',
              date: '2022-03-01',
              title: 'Micro-App-Framework',
              description:
                '轻量级微前端框架，支持多种技术栈混合开发。解决大型应用拆分解耦问题，已在生产环境验证，支撑千万级用户产品。',
              highlights: [
                '支持React、Vue、Angular等多种框架混合使用',
                '完善的沙箱隔离机制，样式和JS完全隔离',
                '预加载和缓存机制，子应用切换零延迟',
                '插件化架构，支持自定义扩展',
                '企业级解决方案，文档完善，社区活跃',
              ],
              type: 'project',
              icon: 'layers',
              tech: [
                'JavaScript',
                'Web Components',
                'Proxy',
                'Shadow DOM',
                'Webpack',
              ],
              metrics: [
                { label: 'GitHub Stars', value: '3.8k' },
                { label: '企业用户', value: '50+' },
                { label: '支撑用户', value: '1000万+' },
                { label: '版本迭代', value: '50+' },
              ],
            },
            {
              id: '8',
              date: '2021-11-01',
              title: 'DevOps-Dashboard',
              description:
                '一站式DevOps可视化平台，集成CI/CD、监控告警、日志分析等功能。帮助团队提升研发效能，缩短交付周期。',
              highlights: [
                '可视化Pipeline编排，降低CI/CD配置复杂度',
                '实时监控大盘，支持自定义告警规则',
                '智能日志分析，快速定位线上问题',
                '成本优化建议，云资源利用率提升35%',
                '开源免费，已帮助100+团队提升研发效能',
              ],
              type: 'project',
              icon: 'cloud',
              tech: [
                'React',
                'D3.js',
                'Node.js',
                'Docker',
                'Prometheus',
                'Grafana',
              ],
              metrics: [
                { label: '部署次数', value: '10万+' },
                { label: '告警响应', value: '<30s' },
                { label: '成本节省', value: '35%' },
                { label: '使用团队', value: '100+' },
              ],
            },
            {
              id: '9',
              date: '2024-01-01',
              title: '2023年度优秀技术专家',
              company: '字节跳动',
              description:
                '因在电商交易系统架构优化中的突出贡献，获得公司级年度优秀技术专家称号。表彰在微前端架构、性能优化、团队建设等方面的卓越成就。',
              highlights: [
                '主导完成微前端架构升级，支撑业务快速增长',
                '建立前端工程化体系，团队效率提升显著',
                '培养多名技术人才，团队技术氛围浓厚',
                '技术影响力覆盖公司多个业务线',
                '获得CTO亲自颁发的荣誉证书',
              ],
              type: 'award',
              icon: 'award',
              metrics: [
                { label: '获奖比例', value: '0.5%' },
                { label: '团队规模', value: '15人' },
                { label: '技术分享', value: '20+' },
                { label: '专利产出', value: '3项' },
              ],
            },
            {
              id: '10',
              date: '2023-06-01',
              title: '开源贡献者之星',
              company: 'GitHub',
              description:
                '因在开源社区的持续贡献，获得GitHub Arctic Code Vault贡献者认证。多个开源项目累计Star数超过1万，影响开发者数万人。',
              highlights: [
                '维护5个高质量开源项目',
                '累计贡献代码10万+行',
                '撰写技术博客50+篇，阅读量百万+',
                '参与知名开源项目贡献，代码被合并',
                '技术演讲10+场，影响数万名开发者',
              ],
              type: 'award',
              icon: 'github',
              metrics: [
                { label: 'GitHub Stars', value: '10k+' },
                { label: '代码贡献', value: '10万+' },
                { label: '技术文章', value: '50+' },
                { label: '读者影响', value: '100万+' },
              ],
            },
            {
              id: '11',
              date: '2022-12-01',
              title: '前端技术大会最佳演讲者',
              company: 'QCon全球软件开发大会',
              description:
                '在QCon大会分享《亿级流量下的前端架构实践》，获得最佳演讲者称号。分享内容涵盖微前端、性能优化、工程化等实战经验。',
              highlights: [
                '演讲评分4.9/5.0，全场最高',
                '现场听众1000+，线上观看10万+',
                '演讲内容被多家技术媒体转载',
                '会后收到50+企业技术咨询',
                '建立个人技术品牌影响力',
              ],
              type: 'award',
              icon: 'lightbulb',
              metrics: [
                { label: '演讲评分', value: '4.9/5' },
                { label: '现场听众', value: '1000+' },
                { label: '线上观看', value: '10万+' },
                { label: '企业咨询', value: '50+' },
              ],
            },
          ]

          const mockProjectsData: Project[] = [
            {
              id: '1',
              title: 'React-Virtual-Pro',
              description: '高性能React虚拟列表组件库，支持百万级数据流畅渲染',
              image:
                'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
              tags: ['React', 'TypeScript', 'Performance'],
              demoUrl: 'https://react-virtual-pro.demo.com',
              repoUrl: 'https://github.com/username/react-virtual-pro',
              featured: true,
            },
            {
              id: '2',
              title: 'Micro-App-Framework',
              description: '轻量级微前端框架，支持多种技术栈混合开发',
              image:
                'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
              tags: ['Micro-Frontend', 'JavaScript', 'Architecture'],
              demoUrl: 'https://micro-app-framework.demo.com',
              repoUrl: 'https://github.com/username/micro-app-framework',
              featured: true,
            },
            {
              id: '3',
              title: 'DevOps-Dashboard',
              description: '一站式DevOps可视化平台，集成CI/CD、监控告警',
              image:
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
              tags: ['DevOps', 'React', 'Node.js', 'Docker'],
              demoUrl: 'https://devops-dashboard.demo.com',
              repoUrl: 'https://github.com/username/devops-dashboard',
              featured: true,
            },
          ]

          const mockSkillsData: Skill[] = [
            {
              name: 'React',
              level: 98,
              category: 'frontend',
              icon: 'react',
              description:
                '精通React生态，包括Hooks、Concurrent Mode、Server Components等高级特性',
            },
            {
              name: 'TypeScript',
              level: 95,
              category: 'frontend',
              icon: 'typescript',
              description: '深入理解类型系统，能够设计复杂的类型定义和泛型约束',
            },
            {
              name: 'Vue.js',
              level: 90,
              category: 'frontend',
              icon: 'vue',
              description:
                '熟练使用Vue 2/3，包括Composition API、Pinia状态管理等',
            },
            {
              name: 'Node.js',
              level: 88,
              category: 'backend',
              icon: 'nodejs',
              description: '能够开发高性能后端服务，熟悉事件循环和异步编程模型',
            },
            {
              name: 'Webpack/Vite',
              level: 92,
              category: 'tools',
              icon: 'webpack',
              description: '精通构建工具配置和优化，能够定制复杂的构建流程',
            },
            {
              name: 'Docker',
              level: 85,
              category: 'devops',
              icon: 'docker',
              description:
                '熟练使用容器化技术，能够编写Dockerfile和Compose配置',
            },
            {
              name: 'Kubernetes',
              level: 80,
              category: 'devops',
              icon: 'kubernetes',
              description: '了解K8s核心概念，能够进行基础的部署和运维操作',
            },
            {
              name: 'GraphQL',
              level: 87,
              category: 'backend',
              icon: 'graphql',
              description: '熟练使用GraphQL进行API设计和数据查询优化',
            },
            {
              name: 'Figma',
              level: 82,
              category: 'design',
              icon: 'figma',
              description: '能够进行UI设计和原型制作，理解设计系统和组件化思维',
            },
            {
              name: 'AI/ML',
              level: 75,
              category: 'ai',
              icon: 'brain',
              description: '了解机器学习基础，能够使用AI工具提升开发效率',
            },
          ]

          const parsedPosts = postsData.map(parsePostDates)
          console.log('Parsed posts count:', parsedPosts.length)
          set({
            posts: parsedPosts,
            projects: mockProjectsData,
            skills: mockSkillsData,
            timeline: mockTimelineData.map(parseTimelineDates),
            isLoading: false,
          })
          console.log('State updated, posts in state:', get().posts.length)
        } catch (error) {
          console.error('Failed to fetch data:', error)
          set({
            error: 'Failed to load data. Please try again later.',
            isLoading: false,
          })
        }
      },

      getFilteredPosts: () => {
        const { posts, selectedCategory, searchQuery } = get()
        return posts.filter(post => {
          const matchesCategory = selectedCategory
            ? post.category === selectedCategory
            : true
          const matchesSearch = searchQuery
            ? post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
              post.tags.some(tag =>
                tag.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : true
          return matchesCategory && matchesSearch
        })
      },

      getFeaturedPosts: () => {
        return get().posts.slice(0, 6)
      },

      getPostBySlug: slug => {
        return get().posts.find(post => post.slug === slug)
      },

      getFeaturedProjects: () => {
        return get().projects.filter(project => project.featured)
      },

      getSkillsByCategory: category => {
        return get().skills.filter(skill => skill.category === category)
      },
    }),
    {
      name: 'blog-storage',
      partialize: state => ({
        posts: state.posts,
        projects: state.projects,
      }),
      onRehydrateStorage: () => state => {
        // 重新解析日期字符串为 Date 对象
        if (state?.posts) {
          state.posts = state.posts.map(post => ({
            ...post,
            publishedAt: new Date(post.publishedAt),
            updatedAt: new Date(post.updatedAt),
          }))
        }
        console.log('Rehydrated posts count:', state?.posts?.length || 0)
      },
    }
  )
)
