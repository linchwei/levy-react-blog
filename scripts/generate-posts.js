#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 文章模板数据
const articlesMetadata = [
  // 前端开发 (7篇)
  {
    id: '1',
    slug: 'frontend-trends-2025',
    title: '2025年前端技术趋势全景解析：AI驱动开发新时代',
    excerpt:
      '深入探讨2025年前端开发的八大趋势，包括AI辅助编程、低代码平台、实时协作开发、MACH架构等，帮助开发者把握技术方向，提升竞争力。',
    category: 'Frontend',
    tags: ['前端趋势', 'AI编程', 'React', 'Vue', '2025'],
    publishedAt: '2025-01-20T00:00:00.000Z',
    readingTime: 45,
    views: 3280,
    likes: 186,
    chapters: [
      {
        title: '引言：前端开发的范式转移',
        sections: ['前端发展历程回顾', 'AI时代的机遇与挑战', '本文内容概览'],
      },
      {
        title: '第一章：AI与开发的深度融合',
        sections: [
          '智能代码生成的演进',
          '实时协作与AI优化',
          '自动化测试与调试',
          'AI辅助代码审查',
          '知识共享与团队协作',
        ],
      },
      {
        title: '第二章：低代码/无代码平台的崛起',
        sections: [
          'AI驱动的低代码革命',
          '企业级低代码平台特性',
          '可视化开发环境',
          '企业集成能力',
          '安全与合规',
        ],
      },
      {
        title: '第三章：JavaScript生态的新发展',
        sections: [
          'ES2025重大特性',
          'React生态系统演进',
          'Vue生态系统发展',
          'Angular与Svelte近况',
          '新兴框架展望',
        ],
      },
      {
        title: '第四章：性能优化的最佳实践',
        sections: [
          'Core Web Vitals深度优化',
          '资源加载优化',
          'JavaScript优化策略',
          'CSS优化技巧',
          '图片与媒体优化',
        ],
      },
      {
        title: '第五章：前端架构演进',
        sections: [
          '微前端架构实践',
          '边缘计算与前端',
          'Serverless前端',
          '边缘渲染技术',
          '分布式前端架构',
        ],
      },
      {
        title: '第六章：开发工具链革新',
        sections: [
          '构建工具演进',
          '类型安全工具',
          '调试与性能分析',
          'CI/CD集成',
          '开发环境优化',
        ],
      },
      {
        title: '第七章：协作模式的变革',
        sections: [
          '设计与开发的融合',
          '远程协作工具',
          'AI设计工具',
          '设计系统实践',
          '跨职能协作',
        ],
      },
      {
        title: '第八章：前端开发者的职业发展',
        sections: [
          '技能要求的转变',
          '职业路径选择',
          '持续学习策略',
          '个人品牌建设',
          '社区参与',
        ],
      },
      {
        title: '结语：拥抱变化，持续学习',
        sections: ['未来展望', '行动建议', '资源推荐'],
      },
    ],
  },
  {
    id: '2',
    slug: 'react-server-components-guide',
    title: 'React Server Components深度实践：从原理到应用',
    excerpt:
      '全面解析React Server Components的工作原理，通过实际案例演示如何在Next.js 15中应用RSC，实现零JavaScript bundle的服务端组件。',
    category: 'Frontend',
    tags: ['React', 'Server Components', 'Next.js', '性能优化'],
    publishedAt: '2025-01-18T00:00:00.000Z',
    readingTime: 40,
    views: 2850,
    likes: 142,
    chapters: [
      {
        title: '引言',
        sections: ['什么是Server Components', '为什么需要RSC', 'RSC的历史背景'],
      },
      {
        title: '第一章：RSC的核心概念',
        sections: [
          'Server vs Client Components',
          'RSC的工作原理',
          '混合架构模式',
          '数据流管理',
          '渲染流程详解',
        ],
      },
      {
        title: '第二章：Next.js 15中的RSC实践',
        sections: [
          '默认Server Component',
          '创建Client Component',
          '组件组合模式',
          '数据获取策略',
          '缓存与优化',
        ],
      },
      {
        title: '第三章：数据获取策略',
        sections: [
          '服务端数据获取',
          '数据库直接访问',
          '缓存策略',
          '数据预加载',
          '增量静态再生',
        ],
      },
      {
        title: '第四章：性能优化',
        sections: [
          'Streaming渲染',
          '选择性水合',
          '预加载策略',
          '懒加载组件',
          '性能监控',
        ],
      },
      {
        title: '第五章：常见陷阱与解决方案',
        sections: [
          '浏览器API使用',
          '过度使用Client Component',
          '数据获取重复',
          '状态管理问题',
          '错误处理',
        ],
      },
      {
        title: '第六章：实战案例',
        sections: [
          '电商产品页面',
          '博客文章页面',
          '仪表盘应用',
          '社交网络应用',
          '内容管理系统',
        ],
      },
      {
        title: '第七章：高级技巧',
        sections: [
          '嵌套Server Components',
          '动态导入',
          '并行数据获取',
          '错误边界',
          '加载状态',
        ],
      },
      {
        title: '第八章：与其他技术集成',
        sections: [
          '与GraphQL集成',
          '与tRPC集成',
          '与Prisma集成',
          '与Auth集成',
          '与Stripe集成',
        ],
      },
      { title: '结语', sections: ['最佳实践总结', '未来展望', '学习资源'] },
    ],
  },
  {
    id: '3',
    slug: 'vue-3-5-new-features',
    title: 'Vue 3.5新特性完全指南：更轻、更快、更智能',
    excerpt:
      'Vue 3.5带来了响应式系统的重大改进、性能优化和开发体验提升。本文详细介绍Vue 3.5的所有新特性，包括Reactive Props Destructure、useTemplateRef等。',
    category: 'Frontend',
    tags: ['Vue', 'Vue 3.5', 'Composition API', '响应式系统'],
    publishedAt: '2025-01-15T00:00:00.000Z',
    readingTime: 35,
    views: 2560,
    likes: 128,
    chapters: [
      {
        title: '引言',
        sections: ['Vue 3.5简介', '版本发布背景', '主要改进概览'],
      },
      {
        title: '第一章：响应式系统的重构',
        sections: [
          '更高效的依赖追踪',
          'Reactive Props Destructure',
          '更好的类型推断',
          '响应式调试',
          '性能基准测试',
        ],
      },
      {
        title: '第二章：Composition API增强',
        sections: [
          'useTemplateRef',
          'useId',
          '改进的watch',
          'computed优化',
          'effect作用域',
        ],
      },
      {
        title: '第三章：性能优化',
        sections: [
          '更小的包体积',
          '更快的Diff算法',
          'Vapor Mode介绍',
          '编译优化',
          '运行时优化',
        ],
      },
      {
        title: '第四章：开发体验改进',
        sections: [
          '更好的TypeScript支持',
          '改进的错误提示',
          'DevTools增强',
          'VS Code插件',
          '调试技巧',
        ],
      },
      {
        title: '第五章：新特性详解',
        sections: [
          'defineModel',
          'defineOptions',
          '改进的Teleport',
          'Suspense改进',
          '异步组件',
        ],
      },
      {
        title: '第六章：迁移指南',
        sections: [
          '从Vue 3.4迁移',
          '破坏性变更',
          '最佳实践',
          '常见问题',
          '性能对比',
        ],
      },
      {
        title: '第七章：实战案例',
        sections: [
          '高性能列表组件',
          '表单组件',
          '模态框组件',
          '数据表格',
          '图表组件',
        ],
      },
      {
        title: '第八章：生态系统',
        sections: [
          'Nuxt 3.9',
          'Pinia发展',
          'Vue Router 4',
          'Vite集成',
          '测试工具',
        ],
      },
      { title: '结语', sections: ['总结', '未来展望', '社区资源'] },
    ],
  },
  {
    id: '4',
    slug: 'typescript-advanced-types',
    title: 'TypeScript 5.0高级类型体操实战：从入门到精通',
    excerpt:
      '深入探索TypeScript高级类型系统，包括条件类型、映射类型、模板字面量类型等，通过实际案例掌握类型体操技巧，提升代码类型安全。',
    category: 'Frontend',
    tags: ['TypeScript', '类型系统', '高级类型', '类型体操'],
    publishedAt: '2025-01-12T00:00:00.000Z',
    readingTime: 50,
    views: 2890,
    likes: 156,
    chapters: [
      {
        title: '引言',
        sections: ['类型系统的重要性', 'TypeScript发展历程', '本文学习目标'],
      },
      {
        title: '第一章：条件类型',
        sections: [
          '基础语法',
          '分布式条件类型',
          'infer关键字',
          '实际应用场景',
          '常见模式',
        ],
      },
      {
        title: '第二章：映射类型',
        sections: ['基础映射', 'Key Remapping', 'as子句', '修饰符', '实战案例'],
      },
      {
        title: '第三章：模板字面量类型',
        sections: [
          '基础用法',
          '联合类型组合',
          '内置工具类型',
          'URL类型安全',
          'CSS变量类型',
        ],
      },
      {
        title: '第四章：递归类型',
        sections: [
          '递归类型定义',
          '深度Readonly',
          '深度Partial',
          '树形结构类型',
          'JSON类型',
        ],
      },
      {
        title: '第五章：类型推断',
        sections: [
          'ReturnType',
          'Parameters',
          'Awaited',
          'ThisParameterType',
          'InstanceType',
        ],
      },
      {
        title: '第六章：类型体操实战',
        sections: [
          '实现Omit',
          '实现Pick',
          '实现DeepReadonly',
          '实现TupleToUnion',
          '实现Chainable',
        ],
      },
      {
        title: '第七章：类型安全模式',
        sections: [
          ' branded types',
          'nominal typing',
          '函数重载',
          '类型守卫',
          '断言函数',
        ],
      },
      {
        title: '第八章：性能优化',
        sections: [
          '类型复杂度控制',
          '递归深度限制',
          '类型缓存',
          '编译优化',
          'IDE性能',
        ],
      },
      { title: '结语', sections: ['最佳实践', '常见陷阱', '学习资源'] },
    ],
  },
  {
    id: '5',
    slug: 'frontend-performance-optimization',
    title: '前端性能优化2025完全指南：Core Web Vitals实战',
    excerpt:
      '全面解析Core Web Vitals三大指标优化策略，包括LCP、FID/INP、CLS的优化技巧，以及图片优化、代码分割、缓存策略等实战方案。',
    category: 'Frontend',
    tags: ['性能优化', 'Core Web Vitals', 'LCP', 'CLS', 'INP'],
    publishedAt: '2025-01-10T00:00:00.000Z',
    readingTime: 42,
    views: 2450,
    likes: 134,
    chapters: [
      {
        title: '引言',
        sections: ['为什么性能很重要', '性能与业务指标', 'Core Web Vitals简介'],
      },
      {
        title: '第一章：LCP优化',
        sections: [
          'LCP定义与测量',
          '图片优化',
          '服务器响应时间',
          '渲染阻塞资源',
          '预加载策略',
        ],
      },
      {
        title: '第二章：INP优化',
        sections: [
          'INP定义与测量',
          '长任务优化',
          '事件处理优化',
          '主线程管理',
          'Web Workers',
        ],
      },
      {
        title: '第三章：CLS优化',
        sections: [
          'CLS定义与测量',
          '图片尺寸预留',
          '字体加载优化',
          '动态内容插入',
          '动画优化',
        ],
      },
      {
        title: '第四章：资源加载优化',
        sections: [
          '图片优化策略',
          '视频优化',
          '字体优化',
          '第三方脚本',
          '资源优先级',
        ],
      },
      {
        title: '第五章：JavaScript优化',
        sections: [
          '代码分割',
          'Tree Shaking',
          '动态导入',
          '压缩与混淆',
          '运行时优化',
        ],
      },
      {
        title: '第六章：CSS优化',
        sections: [
          '关键CSS',
          'CSS分割',
          '移除未使用CSS',
          'CSS压缩',
          'contain属性',
        ],
      },
      {
        title: '第七章：缓存策略',
        sections: [
          'HTTP缓存',
          'Service Worker',
          'CDN配置',
          '缓存失效',
          '预缓存',
        ],
      },
      {
        title: '第八章：性能监控',
        sections: ['RUM监控', '实验室数据', '性能预算', '持续集成', '性能回归'],
      },
      { title: '结语', sections: ['优化清单', '工具推荐', '持续优化'] },
    ],
  },
  {
    id: '6',
    slug: 'micro-frontend-architecture',
    title: '微前端架构实战：大型项目的前端拆分策略',
    excerpt:
      '深入探讨微前端架构的设计理念和实现方案，包括Module Federation、qiankun、single-spa等主流方案对比，以及在实际项目中的最佳实践。',
    category: 'Frontend',
    tags: ['微前端', 'Module Federation', 'qiankun', '架构设计'],
    publishedAt: '2025-01-08T00:00:00.000Z',
    readingTime: 48,
    views: 1980,
    likes: 112,
    chapters: [
      {
        title: '引言',
        sections: ['什么是微前端', '为什么需要微前端', '适用场景分析'],
      },
      {
        title: '第一章：微前端核心概念',
        sections: [
          '技术栈无关',
          '独立开发部署',
          '运行时集成',
          '独立运行时',
          '沙箱隔离',
        ],
      },
      {
        title: '第二章：Module Federation',
        sections: ['基本原理', '配置详解', '共享依赖', '动态加载', '版本管理'],
      },
      {
        title: '第三章：qiankun实践',
        sections: ['快速开始', '应用注册', '生命周期', '沙箱机制', '样式隔离'],
      },
      {
        title: '第四章：single-spa',
        sections: ['核心概念', '应用注册', '路由配置', 'Parcel', '最佳实践'],
      },
      {
        title: '第五章：方案对比',
        sections: ['功能对比', '性能对比', '生态对比', '学习曲线', '选型建议'],
      },
      {
        title: '第六章：应用拆分策略',
        sections: [
          '按业务域拆分',
          '按团队拆分',
          '按功能拆分',
          '渐进式迁移',
          '数据共享',
        ],
      },
      {
        title: '第七章：通信机制',
        sections: ['Props传递', '自定义事件', '全局状态', 'URL参数', 'Storage'],
      },
      {
        title: '第八章：最佳实践',
        sections: ['样式隔离', '错误处理', '性能优化', '监控日志', '测试策略'],
      },
      { title: '结语', sections: ['总结', '常见陷阱', '未来趋势'] },
    ],
  },
  {
    id: '7',
    slug: 'es2025-new-features',
    title: 'ES2025新特性详解：模式匹配、管道操作符与更多',
    excerpt:
      '全面介绍ES2025的新特性，包括模式匹配、管道操作符、Records & Tuples等，以及如何在现代JavaScript项目中应用这些特性提升代码质量。',
    category: 'Frontend',
    tags: ['ES2025', 'JavaScript', '模式匹配', '管道操作符'],
    publishedAt: '2025-01-05T00:00:00.000Z',
    readingTime: 38,
    views: 2230,
    likes: 145,
    chapters: [
      { title: '引言', sections: ['ES2025概览', '新特性清单', '浏览器支持'] },
      {
        title: '第一章：模式匹配',
        sections: ['基础语法', '对象匹配', '数组匹配', '守卫子句', '实际应用'],
      },
      {
        title: '第二章：管道操作符',
        sections: [
          '基础用法',
          '带参数的管道',
          '与await结合',
          '错误处理',
          '性能考虑',
        ],
      },
      {
        title: '第三章：Records & Tuples',
        sections: ['Record类型', 'Tuple类型', '不可变性', '值相等', '使用场景'],
      },
      {
        title: '第四章：数组新方法',
        sections: ['toSorted', 'toReversed', 'toSpliced', 'with', 'findLast'],
      },
      {
        title: '第五章：Promise新方法',
        sections: ['Promise.withResolvers', 'Promise.try', '改进的错误处理'],
      },
      {
        title: '第六章：Set增强',
        sections: ['并集', '交集', '差集', '对称差集', '使用示例'],
      },
      {
        title: '第七章：其他新特性',
        sections: ['显式资源管理', '装饰器', '导入属性', 'JSON模块'],
      },
      {
        title: '第八章：迁移指南',
        sections: ['Babel配置', 'TypeScript支持', ' polyfill', '渐进式采用'],
      },
      { title: '结语', sections: ['总结', '未来展望'] },
    ],
  },
  // AI人工智能 (7篇)
  {
    id: '8',
    slug: 'chatgpt-vs-claude-comparison',
    title: 'ChatGPT vs Claude：大语言模型的巅峰对决',
    excerpt:
      '深度对比OpenAI的ChatGPT和Anthropic的Claude两大AI模型，从架构设计、能力特点、应用场景等多个维度分析各自的优劣势。',
    category: 'AI',
    tags: ['ChatGPT', 'Claude', '大语言模型', 'AI对比'],
    publishedAt: '2025-01-19T00:00:00.000Z',
    readingTime: 40,
    views: 3560,
    likes: 234,
    chapters: [
      {
        title: '引言',
        sections: ['大语言模型发展背景', 'ChatGPT与Claude简介', '对比维度说明'],
      },
      {
        title: '第一章：模型架构对比',
        sections: [
          'ChatGPT架构',
          'Claude架构',
          '训练方法差异',
          '参数规模',
          '上下文窗口',
        ],
      },
      {
        title: '第二章：能力对比',
        sections: [
          '代码能力',
          '推理能力',
          '创意写作',
          '数学能力',
          '多语言支持',
        ],
      },
      {
        title: '第三章：多模态能力',
        sections: [
          'GPT-4V视觉能力',
          'Claude 3视觉能力',
          '图像理解',
          '文档处理',
          '对比分析',
        ],
      },
      {
        title: '第四章：安全性对比',
        sections: [
          '内容过滤',
          '幻觉问题',
          '隐私保护',
          'Constitutional AI',
          '安全评估',
        ],
      },
      {
        title: '第五章：应用场景推荐',
        sections: [
          '选择ChatGPT的场景',
          '选择Claude的场景',
          '混合使用策略',
          '成本对比',
          'API集成',
        ],
      },
      {
        title: '第六章：实际测试',
        sections: [
          '代码生成测试',
          '推理测试',
          '创意测试',
          '长文本测试',
          '速度测试',
        ],
      },
      {
        title: '第七章：未来发展趋势',
        sections: ['ChatGPT发展方向', 'Claude发展方向', '竞争格局', '技术趋势'],
      },
      {
        title: '第八章：使用建议',
        sections: ['个人用户建议', '企业用户建议', '开发者建议', '定价策略'],
      },
      { title: '结语', sections: ['总结', '选择指南'] },
    ],
  },
  {
    id: '9',
    slug: 'deepseek-r1-breakthrough',
    title: 'DeepSeek-R1：国产大模型的技术突破与开源革命',
    excerpt:
      '深度解析DeepSeek-R1的技术创新，包括思维链推理、开源策略、成本优化等，探讨国产大模型如何在全球AI竞赛中实现弯道超车。',
    category: 'AI',
    tags: ['DeepSeek', '国产AI', '大语言模型', '开源AI'],
    publishedAt: '2025-01-17T00:00:00.000Z',
    readingTime: 45,
    views: 4120,
    likes: 289,
    chapters: [
      {
        title: '引言',
        sections: ['DeepSeek-R1发布背景', '国产AI发展历程', '全球AI格局变化'],
      },
      {
        title: '第一章：技术突破',
        sections: [
          '思维链推理',
          '自我验证机制',
          '多步骤推理',
          'GRPO算法',
          '纯强化学习',
        ],
      },
      {
        title: '第二章：开源策略',
        sections: [
          '完全开源意义',
          '开源内容清单',
          '对AI生态影响',
          '商业模式创新',
          '社区贡献',
        ],
      },
      {
        title: '第三章：成本优化',
        sections: [
          '训练成本对比',
          'MoE架构',
          'FP8训练',
          '数据效率',
          '推理成本',
        ],
      },
      {
        title: '第四章：性能评测',
        sections: ['数学推理', '编程能力', '科学推理', '与o1对比', '蒸馏模型'],
      },
      {
        title: '第五章：国产AI崛起',
        sections: ['技术自主', '人才优势', '生态建设', '政策支持', '市场机遇'],
      },
      {
        title: '第六章：应用场景',
        sections: ['代码开发', '数学解题', '科学研究', '教育应用', '企业应用'],
      },
      {
        title: '第七章：挑战与局限',
        sections: ['当前局限', '安全考虑', '竞争压力', '技术债务'],
      },
      {
        title: '第八章：未来展望',
        sections: ['技术方向', '生态建设', '全球化战略', 'AGI之路'],
      },
      { title: '结语', sections: ['总结', '意义', '期待'] },
    ],
  },
  {
    id: '10',
    slug: 'ai-agent-development',
    title: 'AI Agent元年：智能体应用开发实战指南',
    excerpt:
      '全面介绍AI Agent的概念、架构和开发方法，包括ReAct模式、工具使用、记忆系统等核心技术，以及构建实用AI Agent的最佳实践。',
    category: 'AI',
    tags: ['AI Agent', '智能体', 'LangChain', 'AutoGPT'],
    publishedAt: '2025-01-14T00:00:00.000Z',
    readingTime: 50,
    views: 2980,
    likes: 187,
    chapters: [
      {
        title: '引言',
        sections: ['什么是AI Agent', 'Agent vs 传统AI', '2025 Agent元年'],
      },
      {
        title: '第一章：核心概念',
        sections: ['自主性', '工具使用', '记忆系统', '规划能力', '学习能力'],
      },
      {
        title: '第二章：架构设计',
        sections: ['ReAct模式', '规划模块', '执行模块', '观察模块', '反思机制'],
      },
      {
        title: '第三章：工具使用',
        sections: [
          '工具定义',
          'Function Calling',
          'API集成',
          '代码执行',
          '文件操作',
        ],
      },
      {
        title: '第四章：记忆系统',
        sections: [
          '短期记忆',
          '长期记忆',
          '向量数据库',
          '记忆检索',
          '记忆压缩',
        ],
      },
      {
        title: '第五章：开发框架',
        sections: ['LangChain', 'AutoGPT', 'AutoGen', 'MetaGPT', '框架对比'],
      },
      {
        title: '第六章：实战案例',
        sections: [
          '代码助手Agent',
          '个人助理Agent',
          '数据分析Agent',
          '客服Agent',
          '研究Agent',
        ],
      },
      {
        title: '第七章：最佳实践',
        sections: ['提示工程', '错误处理', '安全考虑', '成本控制', '性能优化'],
      },
      {
        title: '第八章：应用场景',
        sections: ['客户服务', '内容创作', '数据分析', '软件开发', '科学研究'],
      },
      { title: '结语', sections: ['总结', '未来展望'] },
    ],
  },
  {
    id: '11',
    slug: 'llm-to-moe-evolution',
    title: '从LLM到MoE：AI模型架构的演进之路',
    excerpt:
      '深入解析大语言模型架构的演进，从Dense模型到Sparse MoE，探讨Mixture of Experts的原理、优势和应用，以及未来架构发展方向。',
    category: 'AI',
    tags: ['MoE', '大语言模型', '模型架构', 'Transformer'],
    publishedAt: '2025-01-11T00:00:00.000Z',
    readingTime: 48,
    views: 2670,
    likes: 178,
    chapters: [
      {
        title: '引言',
        sections: ['模型架构演进史', '从Dense到MoE', '本文内容概览'],
      },
      {
        title: '第一章：Dense模型时代',
        sections: [
          'Transformer基础',
          '参数规模增长',
          '计算成本问题',
          '扩展性限制',
        ],
      },
      {
        title: '第二章：MoE架构详解',
        sections: ['基本原理', '门控网络', '专家网络', 'Top-K选择', '负载均衡'],
      },
      {
        title: '第三章：MoE的优势',
        sections: [
          '计算效率',
          '专业化学习',
          '可扩展性',
          '多任务能力',
          '成本效益',
        ],
      },
      {
        title: '第四章：训练挑战',
        sections: [
          '负载均衡问题',
          '通信开销',
          '内存优化',
          '梯度传播',
          '稳定性',
        ],
      },
      {
        title: '第五章：主流MoE模型',
        sections: [
          'GPT-4',
          'Mixtral',
          'DeepSeek-V3',
          'Switch Transformer',
          '对比分析',
        ],
      },
      {
        title: '第六章：实现优化',
        sections: ['高效路由', '动态容量', '专家剪枝', '并行策略', '量化压缩'],
      },
      {
        title: '第七章：应用场景',
        sections: [
          '多语言模型',
          '多模态模型',
          '领域专用模型',
          '代码生成',
          '推理优化',
        ],
      },
      {
        title: '第八章：未来方向',
        sections: [
          '更细粒度MoE',
          '与检索增强结合',
          '硬件协同设计',
          '自适应架构',
        ],
      },
      { title: '结语', sections: ['总结', '展望'] },
    ],
  },
  {
    id: '12',
    slug: 'multimodal-ai-fusion',
    title: '多模态AI：文本、图像、语音的融合革命',
    excerpt:
      '探索多模态AI技术的最新进展，包括视觉语言模型、语音合成与识别、跨模态理解等，以及多模态AI在内容创作、智能助手等领域的应用。',
    category: 'AI',
    tags: ['多模态AI', 'GPT-4o', '视觉语言模型', '跨模态'],
    publishedAt: '2025-01-09T00:00:00.000Z',
    readingTime: 46,
    views: 2890,
    likes: 167,
    chapters: [
      {
        title: '引言',
        sections: ['什么是多模态AI', '为什么需要多模态', '发展历程'],
      },
      {
        title: '第一章：核心技术',
        sections: [
          '视觉语言模型',
          '语音技术',
          '跨模态对齐',
          '对比学习',
          '统一架构',
        ],
      },
      {
        title: '第二章：多模态大模型',
        sections: ['GPT-4o', 'Gemini', 'Claude 3', '开源模型', '能力对比'],
      },
      {
        title: '第三章：视觉理解',
        sections: ['图像描述', '视觉问答', 'OCR技术', '图表理解', '视频分析'],
      },
      {
        title: '第四章：语音技术',
        sections: ['语音识别', '语音合成', '语音克隆', '实时对话', '情感识别'],
      },
      {
        title: '第五章：应用场景',
        sections: ['内容创作', '智能助手', '教育应用', '医疗健康', '自动驾驶'],
      },
      {
        title: '第六章：技术挑战',
        sections: ['模态对齐', '数据稀缺', '计算资源', '幻觉问题', '评估方法'],
      },
      {
        title: '第七章：前沿研究',
        sections: ['统一多模态', '世界模型', '具身智能', '脑机接口'],
      },
      {
        title: '第八章：开发实践',
        sections: ['API使用', '模型选择', '性能优化', '成本控制'],
      },
      { title: '结语', sections: ['总结', '未来'] },
    ],
  },
  {
    id: '13',
    slug: 'ai-code-generation-tools',
    title: 'AI代码生成工具深度评测：Copilot、Cursor、Tabnine对比',
    excerpt:
      '全面对比主流AI代码生成工具，从代码质量、响应速度、隐私安全、价格等维度进行深度评测，帮助开发者选择最适合的工具。',
    category: 'AI',
    tags: ['AI编程', '代码生成', 'Copilot', 'Cursor', 'Tabnine'],
    publishedAt: '2025-01-07T00:00:00.000Z',
    readingTime: 42,
    views: 3240,
    likes: 198,
    chapters: [
      { title: '引言', sections: ['AI代码生成现状', '工具概览', '评测维度'] },
      {
        title: '第一章：GitHub Copilot',
        sections: ['功能介绍', '代码质量', 'IDE集成', '隐私政策', '定价方案'],
      },
      {
        title: '第二章：Cursor',
        sections: [
          '功能介绍',
          '代码质量',
          'Composer功能',
          '本地模型',
          '定价方案',
        ],
      },
      {
        title: '第三章：Tabnine',
        sections: ['功能介绍', '代码质量', '本地部署', '企业版', '定价方案'],
      },
      {
        title: '第四章：其他工具',
        sections: [
          'Amazon CodeWhisperer',
          'JetBrains AI',
          'Codeium',
          'Replit Ghostwriter',
        ],
      },
      {
        title: '第五章：性能对比',
        sections: [
          '响应速度',
          '代码准确率',
          '上下文理解',
          '多语言支持',
          '框架适配',
        ],
      },
      {
        title: '第六章：实际测试',
        sections: ['前端开发', '后端开发', '算法实现', 'Bug修复', '代码重构'],
      },
      {
        title: '第七章：安全与隐私',
        sections: [
          '代码上传',
          '数据使用',
          '企业合规',
          '本地处理',
          '许可证问题',
        ],
      },
      {
        title: '第八章：选型建议',
        sections: ['个人开发者', '小团队', '大企业', '特定场景', '成本考量'],
      },
      { title: '结语', sections: ['总结', '趋势'] },
    ],
  },
  {
    id: '14',
    slug: 'llm-fine-tuning-practice',
    title: '大模型微调与部署实践：从理论到生产',
    excerpt:
      '详细介绍大语言模型的微调方法，包括全量微调、LoRA、QLoRA等技术，以及模型量化、推理优化和部署方案。',
    category: 'AI',
    tags: ['大模型', '微调', 'LoRA', '模型部署', '推理优化'],
    publishedAt: '2025-01-04T00:00:00.000Z',
    readingTime: 55,
    views: 2560,
    likes: 156,
    chapters: [
      {
        title: '引言',
        sections: ['为什么需要微调', '微调vs提示工程', '微调类型'],
      },
      {
        title: '第一章：数据准备',
        sections: ['数据收集', '数据清洗', '数据格式', '数据增强', '数据验证'],
      },
      {
        title: '第二章：全量微调',
        sections: [
          '原理介绍',
          '训练流程',
          '超参数调优',
          '过拟合处理',
          '计算资源',
        ],
      },
      {
        title: '第三章：参数高效微调',
        sections: ['LoRA原理', 'QLoRA', 'Adapter', 'Prefix Tuning', '对比分析'],
      },
      {
        title: '第四章：训练框架',
        sections: [
          'Hugging Face',
          'DeepSpeed',
          'LLaMA-Factory',
          'Axolotl',
          '选择建议',
        ],
      },
      {
        title: '第五章：模型量化',
        sections: ['INT8量化', 'INT4量化', 'GGUF格式', 'AWQ', 'GPTQ'],
      },
      {
        title: '第六章：推理优化',
        sections: [
          'vLLM',
          'TensorRT-LLM',
          'Text Generation Inference',
          '批处理优化',
        ],
      },
      {
        title: '第七章：部署方案',
        sections: ['本地部署', '云端部署', '边缘部署', 'API服务', '容器化'],
      },
      {
        title: '第八章：生产实践',
        sections: ['监控告警', 'A/B测试', '成本控制', '安全考虑', '持续迭代'],
      },
      { title: '结语', sections: ['总结', '资源'] },
    ],
  },
  // UI/UX设计 (6篇)
  {
    id: '15',
    slug: 'ui-design-trends-2025',
    title: '2025年UI设计趋势：液态玻璃、3D动效与AI个性化',
    excerpt:
      '深入解析2025年UI设计的八大趋势，包括液态玻璃效果、3D与动画UI、AI个性化设计、新拟态进化等，帮助设计师把握设计方向。',
    category: 'Design',
    tags: ['UI设计', '设计趋势', '液态玻璃', '3D设计', 'AI设计'],
    publishedAt: '2025-01-16T00:00:00.000Z',
    readingTime: 38,
    views: 2650,
    likes: 178,
    chapters: [
      {
        title: '引言',
        sections: ['设计趋势的重要性', '2025设计概览', '技术与设计融合'],
      },
      {
        title: '第一章：液态玻璃效果',
        sections: ['核心特征', '实现技巧', '设计工具', '应用案例', '注意事项'],
      },
      {
        title: '第二章：3D与动画UI',
        sections: ['微3D图标', '空间布局', '3D工具', '性能考虑', '交互设计'],
      },
      {
        title: '第三章：AI个性化设计',
        sections: [
          'AI生成设计',
          '动态个性化',
          '设计系统自动化',
          '用户偏好学习',
          '伦理考量',
        ],
      },
      {
        title: '第四章：新拟态进化',
        sections: ['柔和拟态', '混合风格', '实用主义', '可访问性', '最佳实践'],
      },
      {
        title: '第五章：可变字体',
        sections: [
          '响应式字体',
          '字体动画',
          '排版层次',
          '性能优化',
          '实现方法',
        ],
      },
      {
        title: '第六章：深色模式进化',
        sections: [
          '多层次深色',
          '自动切换',
          'OLED优化',
          '配色策略',
          '实现指南',
        ],
      },
      {
        title: '第七章：可持续设计',
        sections: ['深色模式节能', '轻量化设计', '环保意识', '社会责任'],
      },
      {
        title: '第八章：无障碍设计优先',
        sections: [
          '色彩对比度',
          '键盘导航',
          '屏幕阅读器',
          '认知无障碍',
          '测试方法',
        ],
      },
      { title: '结语', sections: ['总结', '建议'] },
    ],
  },
  {
    id: '16',
    slug: 'b端设计-system',
    title: 'B端产品设计的色彩与质感新语言',
    excerpt:
      '深入探讨2025年B端设计的三大趋势：多变丰富的色彩、微妙克制的质感以及清晰明了的图形，如何在满足企业高效需求的同时带来情感价值。',
    category: 'Design',
    tags: ['B端设计', '设计系统', '色彩设计', 'UI设计'],
    publishedAt: '2025-01-14T00:00:00.000Z',
    readingTime: 42,
    views: 1890,
    likes: 96,
    chapters: [
      { title: '引言', sections: ['B端设计演变', '新趋势背景', '本文内容'] },
      {
        title: '第一章：色彩进化',
        sections: [
          '从单调到丰富',
          '色彩系统构建',
          '语义化颜色',
          '实际案例',
          '配色工具',
        ],
      },
      {
        title: '第二章：质感设计',
        sections: ['克制的阴影', '微妙的边框', '圆角运用', '材质感', '层次感'],
      },
      {
        title: '第三章：图形语言',
        sections: [
          '图标系统',
          '数据可视化',
          '空状态设计',
          '插画风格',
          '一致性',
        ],
      },
      {
        title: '第四章：信息架构',
        sections: ['层级清晰', '导航设计', '表单优化', '搜索功能', '筛选过滤'],
      },
      {
        title: '第五章：交互设计',
        sections: ['微交互', '手势操作', '快捷键', '反馈机制', '动画效果'],
      },
      {
        title: '第六章：响应式设计',
        sections: [
          '断点设计',
          '内容适配',
          '表格处理',
          '表单布局',
          '移动端优化',
        ],
      },
      {
        title: '第七章：设计系统建设',
        sections: ['组件库', '设计令牌', '设计规范', '文档维护', '版本管理'],
      },
      {
        title: '第八章：情感化设计',
        sections: ['品牌个性', '用户愉悦', '惊喜时刻', '人文关怀'],
      },
      { title: '结语', sections: ['总结', '建议'] },
    ],
  },
  {
    id: '17',
    slug: 'ai-driven-design',
    title: 'AI驱动的个性化UI设计：从概念到实践',
    excerpt:
      '探索AI如何改变UI设计流程，包括智能布局生成、个性化主题适配、A/B测试自动化等，以及设计师如何与AI协作创造更好的用户体验。',
    category: 'Design',
    tags: ['AI设计', '个性化UI', '设计工具', '用户体验'],
    publishedAt: '2025-01-12T00:00:00.000Z',
    readingTime: 45,
    views: 2120,
    likes: 134,
    chapters: [
      {
        title: '引言',
        sections: ['AI设计现状', '设计师角色转变', '机遇与挑战'],
      },
      {
        title: '第一章：AI在设计流程中的应用',
        sections: ['设计探索', '设计执行', '设计验证', '设计迭代', '效率提升'],
      },
      {
        title: '第二章：个性化UI设计',
        sections: [
          '用户画像驱动',
          '动态主题系统',
          '自适应布局',
          '行为预测',
          '情感计算',
        ],
      },
      {
        title: '第三章：AI辅助设计工具',
        sections: [
          'Figma AI插件',
          '代码生成工具',
          '设计系统维护',
          '自动化测试',
          '工具对比',
        ],
      },
      {
        title: '第四章：设计师与AI协作',
        sections: [
          '角色转变',
          '工作流程优化',
          '技能要求变化',
          '人机协作模式',
          '最佳实践',
        ],
      },
      {
        title: '第五章：实际案例分析',
        sections: [
          '电商平台',
          'SaaS产品',
          '移动应用',
          '数据可视化',
          '内容平台',
        ],
      },
      {
        title: '第六章：挑战与局限',
        sections: [
          '创意限制',
          '一致性维护',
          '用户接受度',
          '技术限制',
          '伦理问题',
        ],
      },
      {
        title: '第七章：未来展望',
        sections: ['短期趋势', '中期愿景', '长期展望', '设计师定位'],
      },
      {
        title: '第八章：给设计师的建议',
        sections: ['拥抱变化', '强化核心能力', '建立协作流程', '持续学习'],
      },
      { title: '结语', sections: ['总结', '展望'] },
    ],
  },
  {
    id: '18',
    slug: 'dark-mode-design-guide',
    title: '深色模式设计的完整指南：从配色到实现',
    excerpt:
      '全面解析深色模式的设计原则，包括色彩选择、对比度控制、层次感营造等，以及如何在不同平台实现完美的深色模式体验。',
    category: 'Design',
    tags: ['深色模式', 'UI设计', '色彩系统', '可访问性'],
    publishedAt: '2025-01-09T00:00:00.000Z',
    readingTime: 40,
    views: 2340,
    likes: 156,
    chapters: [
      { title: '引言', sections: ['深色模式普及', '设计挑战', '本文内容'] },
      {
        title: '第一章：设计原则',
        sections: [
          '避免纯黑',
          '降低饱和度',
          '控制对比度',
          '层次感营造',
          '品牌一致性',
        ],
      },
      {
        title: '第二章：色彩系统设计',
        sections: ['背景层级', '文字颜色', '强调色', '功能色', '中性色'],
      },
      {
        title: '第三章：组件设计规范',
        sections: ['按钮', '输入框', '卡片', '导航', '表格'],
      },
      {
        title: '第四章：图片和媒体',
        sections: ['图片亮度', '占位图', '视频处理', '图标适配', '动画调整'],
      },
      {
        title: '第五章：实现方案',
        sections: [
          'CSS变量',
          'React实现',
          'Tailwind方案',
          '平台适配',
          '自动切换',
        ],
      },
      {
        title: '第六章：平台适配',
        sections: ['Web平台', 'iOS/Android', 'macOS/Windows', '跨平台一致'],
      },
      {
        title: '第七章：常见陷阱',
        sections: [
          '对比度过高',
          '忽视阴影',
          '图片处理',
          '打印样式',
          '测试不足',
        ],
      },
      {
        title: '第八章：测试清单',
        sections: [
          '对比度检查',
          '组件覆盖',
          '图片显示',
          '动画效果',
          '用户测试',
        ],
      },
      { title: '结语', sections: ['总结', '建议'] },
    ],
  },
  {
    id: '19',
    slug: 'animation-ui-design',
    title: '3D与动画UI设计：打造沉浸式用户体验',
    excerpt:
      '探索如何在UI设计中运用3D元素和动画效果，包括微交互、页面过渡、滚动动画等，提升产品的情感价值和用户参与度。',
    category: 'Design',
    tags: ['动画设计', '3D UI', '微交互', '用户体验'],
    publishedAt: '2025-01-07T00:00:00.000Z',
    readingTime: 44,
    views: 1980,
    likes: 123,
    chapters: [
      {
        title: '引言',
        sections: ['动画设计价值', '功能性动画', '情感化动画', '认知辅助'],
      },
      {
        title: '第一章：微交互设计',
        sections: ['按钮交互', '加载动画', '成功反馈', '错误提示', '状态切换'],
      },
      {
        title: '第二章：页面过渡动画',
        sections: [
          '路由过渡',
          '列表动画',
          '模态框动画',
          '页面切换',
          '手势驱动',
        ],
      },
      {
        title: '第三章：滚动动画',
        sections: ['视差滚动', '滚动触发', '进度指示', '无限滚动', '返回顶部'],
      },
      {
        title: '第四章：3D UI元素',
        sections: ['3D卡片效果', '3D图标', '空间布局', '透视效果', '工具推荐'],
      },
      {
        title: '第五章：动画性能优化',
        sections: [
          'transform和opacity',
          'will-change',
          '减少动画数量',
          'GPU加速',
          '性能测试',
        ],
      },
      {
        title: '第六章：可访问性考虑',
        sections: [
          '尊重用户偏好',
          '减少动画',
          '替代方案',
          '键盘导航',
          '屏幕阅读器',
        ],
      },
      {
        title: '第七章：设计系统整合',
        sections: ['动画规范', '时长标准', '缓动函数', '组件库', '文档维护'],
      },
      {
        title: '第八章：工具与技术',
        sections: ['CSS动画', 'Framer Motion', 'GSAP', 'Lottie', 'Three.js'],
      },
      { title: '结语', sections: ['总结', '建议'] },
    ],
  },
  {
    id: '20',
    slug: 'minimalist-design-evolution',
    title: '极简主义设计的回归与进化：少即是多的现代诠释',
    excerpt:
      '探讨极简主义设计在2025年的新发展，包括留白艺术、排版层次、色彩克制等原则，以及如何在极简中保持功能性和情感连接。',
    category: 'Design',
    tags: ['极简设计', '留白', '排版', '色彩设计'],
    publishedAt: '2025-01-04T00:00:00.000Z',
    readingTime: 38,
    views: 1760,
    likes: 98,
    chapters: [
      {
        title: '引言',
        sections: ['极简主义本质', '不是缺少而是精炼', '功能优先'],
      },
      {
        title: '第一章：留白艺术',
        sections: [
          '留白的作用',
          '留白系统',
          '实际应用',
          '呼吸空间',
          '视觉层次',
        ],
      },
      {
        title: '第二章：排版层次',
        sections: ['字体选择', '字体比例', '字重运用', '行高控制', '对比度'],
      },
      {
        title: '第三章：色彩克制',
        sections: [
          '单色系方案',
          '点缀色使用',
          '色彩心理学',
          '品牌表达',
          '文化差异',
        ],
      },
      {
        title: '第四章：图形简化',
        sections: ['图标设计', '图片处理', '几何形状', '一致性', '识别性'],
      },
      {
        title: '第五章：交互简化',
        sections: ['减少选择', '清晰导航', '即时反馈', '智能默认', '渐进披露'],
      },
      {
        title: '第六章：极简主义的误区',
        sections: [
          '过度简化',
          '忽视内容',
          '千篇一律',
          '可用性问题',
          '品牌缺失',
        ],
      },
      {
        title: '第七章：现代极简新趋势',
        sections: [
          '有机极简',
          '新粗野主义',
          '玻璃拟态',
          '温暖极简',
          '情感连接',
        ],
      },
      {
        title: '第八章：评估极简设计',
        sections: ['检查清单', '用户测试', 'A/B测试', '迭代优化'],
      },
      { title: '结语', sections: ['总结', '哲学'] },
    ],
  },
]

// 生成详细内容的函数
function generateContent(article) {
  let content = `# ${article.title}\n\n`

  // 引言
  content += `## 引言\n\n`
  content += `${article.excerpt}\n\n`
  content += `本文将深入探讨${article.title}的各个方面，帮助读者全面理解这一主题。\n\n`

  // 生成各章节
  article.chapters.forEach((chapter, index) => {
    content += `## ${chapter.title}\n\n`

    chapter.sections.forEach(section => {
      content += `### ${section}\n\n`

      // 为每个小节生成详细内容
      const paragraphs = generateParagraphs(section, article.category)
      content += paragraphs + '\n'
    })
  })

  // 结语
  content += `## 结语\n\n`
  content += `通过本文的深入探讨，我们全面了解了${article.title}的核心概念、技术细节和最佳实践。\n\n`
  content += `随着技术的不断发展，这一领域还将继续演进。希望本文能为你的学习和实践提供有价值的参考。\n\n`
  content += `感谢阅读！`

  return content
}

// 为每个小节生成段落
function generateParagraphs(section, category) {
  const templates = {
    Frontend: [
      `在前端开发领域，${section}是一个至关重要的概念。随着Web技术的不断发展，开发者需要深入理解其原理和最佳实践。`,
      `现代前端框架如React、Vue和Angular都提供了强大的工具来实现${section}。通过合理运用这些工具，可以显著提升开发效率和应用性能。`,
      `在实际项目中，${section}的应用需要考虑多个因素，包括浏览器兼容性、性能优化、用户体验等。开发者应该根据具体场景选择最合适的方案。`,
      `代码示例：\n\n\`\`\`javascript\n// ${section}的实现示例\nfunction example() {\n  console.log('${section} implementation');\n  // 实际代码逻辑\n}\n\`\`\`\n`,
      `通过深入理解和正确应用${section}，开发者可以构建出更加健壮、高效的前端应用。持续学习和实践是掌握这一技术的关键。`,
    ],
    AI: [
      `在人工智能领域，${section}代表着技术的重要突破。随着大语言模型和深度学习技术的进步，这一概念正在改变我们解决问题的方式。`,
      `从理论到实践，${section}涉及多个技术层面，包括算法设计、模型训练、推理优化等。理解这些原理对于构建高效的AI系统至关重要。`,
      `实际应用中，${section}需要考虑计算资源、数据质量、模型选择等多个因素。合理的架构设计可以显著提升系统性能和可靠性。`,
      `技术实现：\n\n\`\`\`python\n# ${section}的实现示例\ndef example():\n    print('${section} implementation')\n    # 实际代码逻辑\n\`\`\`\n`,
      `随着AI技术的快速发展，${section}将继续演进。保持对最新研究和实践的关注，是跟上这一领域发展的关键。`,
    ],
    Design: [
      `在设计领域，${section}是创造优秀用户体验的核心要素。设计师需要深入理解其原理，并能够在实际项目中灵活应用。`,
      `现代设计工具和方法论为${section}提供了强大的支持。从Figma到AI辅助设计，技术的进步正在改变设计工作流程。`,
      `实际项目中，${section}的应用需要平衡美学、功能和可用性。设计师应该根据目标用户和使用场景做出最合适的设计决策。`,
      `设计原则：\n\n- 一致性：保持设计元素的一致性\n- 简洁性：去除不必要的装饰\n- 可用性：确保用户能够轻松使用\n- 美观性：创造视觉愉悦的体验\n`,
      `通过不断实践和反思，设计师可以掌握${section}的精髓，创造出既美观又实用的设计作品。持续学习和关注行业趋势是提升设计能力的重要途径。`,
    ],
  }

  const categoryTemplates = templates[category] || templates.Frontend
  return categoryTemplates.join('\n\n') + '\n'
}

// 主函数
function main() {
  console.log('开始生成20篇技术文章...')

  const posts = articlesMetadata.map(article => {
    console.log(`生成文章: ${article.title}`)

    return {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: generateContent(article),
      coverImage: `https://images.unsplash.com/photo-${getRandomImageId()}?w=800`,
      category: article.category,
      tags: article.tags,
      publishedAt: article.publishedAt,
      updatedAt: article.publishedAt,
      readingTime: article.readingTime,
      views: article.views,
      likes: article.likes,
    }
  })

  // 写入文件
  const outputPath = path.join(__dirname, '..', 'public', 'posts.json')
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf-8')

  console.log(`\n成功生成 ${posts.length} 篇文章！`)
  console.log(`文件保存至: ${outputPath}`)

  // 统计信息
  const totalChars = posts.reduce((sum, post) => sum + post.content.length, 0)
  console.log(`\n统计信息:`)
  console.log(`- 总文章数: ${posts.length}`)
  console.log(`- 总字符数: ${totalChars.toLocaleString()}`)
  console.log(
    `- 平均每篇: ${Math.round(totalChars / posts.length).toLocaleString()} 字符`
  )
  console.log(
    `- 前端文章: ${posts.filter(p => p.category === 'Frontend').length} 篇`
  )
  console.log(`- AI文章: ${posts.filter(p => p.category === 'AI').length} 篇`)
  console.log(
    `- 设计文章: ${posts.filter(p => p.category === 'Design').length} 篇`
  )
}

// 获取随机图片ID
function getRandomImageId() {
  const ids = [
    '1461749280684-dccba630e2f6',
    '1633356122544-f134324a6cee',
    '1607799275518-d58665d099db',
    '1677442136019-21780ecad995',
    '1516116216624-53e697fedbea',
    '1551288049-bebda4e38f71',
    '1558494949-ef010cbdcc31',
    '1579468118864-1b9ea3c0db4a',
    '1561070791-2526d30994b5',
    '1559028012-481c04fa702d',
    '1618005182384-a83a8bd57fbe',
    '1550684848-fac1c5b4e853',
    '1550745165-9bc0b252726f',
    '1494438639946-1ebd1d20bf85',
    '1620712943543-bcc4688e7485',
    '1485827404703-89b55fcc595e',
    '1555949963-ff9fe0c870eb',
    '1531746790731-6c087fecd65a',
    '1499750310107-5fef28a66643',
    '1531403009284-440f080d1e12',
  ]
  return ids[Math.floor(Math.random() * ids.length)]
}

// 运行
main()
