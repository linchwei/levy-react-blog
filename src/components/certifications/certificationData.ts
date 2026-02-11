export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId: string
  verifyUrl: string
  badge: string
  skills: string[]
}

export interface SkillProgress {
  name: string
  level: number
  category: 'frontend' | 'backend' | 'devops' | 'ai' | 'other'
  learning: boolean
}

export const certifications: Certification[] = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    issueDate: '2024-01',
    expiryDate: '2027-01',
    credentialId: 'AWS-SAA-12345678',
    verifyUrl: 'https://aws.amazon.com/verification',
    badge: '/badges/aws-saa.png',
    skills: ['Cloud Computing', 'AWS', 'Architecture Design'],
  },
  {
    id: '2',
    name: 'Google Cloud Professional Cloud Architect',
    issuer: 'Google Cloud',
    issueDate: '2023-06',
    expiryDate: '2025-06',
    credentialId: 'GCP-PCA-87654321',
    verifyUrl: 'https://google.com/verification',
    badge: '/badges/gcp-pca.png',
    skills: ['Google Cloud', 'Cloud Architecture', 'Kubernetes'],
  },
  {
    id: '3',
    name: 'React Developer Certification',
    issuer: 'Meta',
    issueDate: '2023-03',
    credentialId: 'META-REACT-11223344',
    verifyUrl: 'https://meta.com/verification',
    badge: '/badges/react-meta.png',
    skills: ['React', 'JavaScript', 'Frontend Development'],
  },
  {
    id: '4',
    name: 'MongoDB Certified Developer',
    issuer: 'MongoDB University',
    issueDate: '2022-11',
    credentialId: 'MDB-DEV-55667788',
    verifyUrl: 'https://mongodb.com/verification',
    badge: '/badges/mongodb.png',
    skills: ['MongoDB', 'Database', 'NoSQL'],
  },
]

export const skillProgress: SkillProgress[] = [
  { name: 'React', level: 95, category: 'frontend', learning: false },
  { name: 'TypeScript', level: 90, category: 'frontend', learning: false },
  { name: 'Node.js', level: 85, category: 'backend', learning: false },
  { name: 'Python', level: 75, category: 'backend', learning: false },
  { name: 'Docker', level: 80, category: 'devops', learning: false },
  { name: 'Kubernetes', level: 65, category: 'devops', learning: true },
  { name: 'AWS', level: 85, category: 'devops', learning: false },
  { name: 'Machine Learning', level: 60, category: 'ai', learning: true },
  { name: 'Rust', level: 50, category: 'other', learning: true },
  { name: 'GraphQL', level: 80, category: 'frontend', learning: false },
]

export const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-500',
  backend: 'bg-green-500',
  devops: 'bg-orange-500',
  ai: 'bg-purple-500',
  other: 'bg-gray-500',
}

export const categoryLabels: Record<string, string> = {
  frontend: '前端技术',
  backend: '后端技术',
  devops: '运维/DevOps',
  ai: '人工智能',
  other: '其他',
}
