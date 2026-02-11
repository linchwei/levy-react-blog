export interface GalleryItem {
  id: string
  src: string
  thumbnail: string
  title: string
  category: string
  description: string
  date: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    title: '电商后台管理系统',
    category: 'UI设计',
    description: '完整的后台管理界面设计，包含数据可视化、用户管理、订单管理等模块',
    date: '2024-01',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: '数据可视化大屏',
    category: '数据可视化',
    description: '实时数据监控大屏，支持多种图表类型和实时数据更新',
    date: '2023-12',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    title: '移动应用界面',
    category: '移动应用',
    description: 'iOS/Android 双端应用设计，注重用户体验和交互细节',
    date: '2023-10',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1555421689-d68471e189f2?w=400&h=300&fit=crop',
    title: '企业官网设计',
    category: 'UI设计',
    description: '现代化企业官网，响应式设计，支持深色模式',
    date: '2023-09',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=300&fit=crop',
    title: '数据分析平台',
    category: '数据可视化',
    description: '企业级数据分析平台，支持自定义报表和数据导出',
    date: '2023-08',
  },
  {
    id: '6',
    src: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=400&h=300&fit=crop',
    title: '社交媒体App',
    category: '移动应用',
    description: '社交媒体应用界面设计，包含动态、消息、个人中心等模块',
    date: '2023-07',
  },
  {
    id: '7',
    src: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    title: 'Landing Page',
    category: 'UI设计',
    description: '产品落地页设计，注重转化率和用户体验',
    date: '2023-06',
  },
  {
    id: '8',
    src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    title: 'Dashboard 设计',
    category: '数据可视化',
    description: 'SaaS 产品仪表板设计，简洁高效的数据展示',
    date: '2023-05',
  },
]

export const categories = ['全部', 'UI设计', '数据可视化', '移动应用']
