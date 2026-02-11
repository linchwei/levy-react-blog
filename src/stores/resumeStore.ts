import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Experience {
  id: string
  company: string
  position: string
  duration: string
  description: string
}

export interface Education {
  id: string
  school: string
  degree: string
  duration: string
}

export interface Project {
  id: string
  name: string
  description: string
  link?: string
}

export interface ResumeData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
}

export type ResumeTemplate = 'modern' | 'minimal' | 'creative'

interface ResumeState {
  data: ResumeData
  template: ResumeTemplate
  setData: (data: ResumeData) => void
  setTemplate: (template: ResumeTemplate) => void
  updateField: <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => void
  addExperience: (exp: Experience) => void
  removeExperience: (id: string) => void
  addEducation: (edu: Education) => void
  removeEducation: (id: string) => void
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
}

const defaultResumeData: ResumeData = {
  name: '张三',
  title: '高级前端工程师',
  email: 'zhangsan@example.com',
  phone: '138-0000-0000',
  location: '北京',
  website: 'https://github.com/zhangsan',
  summary: '5年前端开发经验，专注于React生态和性能优化。热爱开源，积极参与技术社区分享。',
  experience: [
    {
      id: '1',
      company: '某知名互联网公司',
      position: '高级前端工程师',
      duration: '2021.06 - 至今',
      description: '负责公司核心产品的前端架构设计和性能优化，带领5人团队完成多个重点项目',
    },
    {
      id: '2',
      company: '某创业公司',
      position: '前端工程师',
      duration: '2019.07 - 2021.05',
      description: '负责公司官网和后台管理系统开发，使用React和TypeScript技术栈',
    },
  ],
  education: [
    {
      id: '1',
      school: '某某大学',
      degree: '计算机科学与技术 本科',
      duration: '2015.09 - 2019.06',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Webpack', 'Git', 'Docker'],
  projects: [
    {
      id: '1',
      name: '个人博客系统',
      description: '基于React和Node.js开发的全栈博客系统，支持Markdown编辑和评论功能',
      link: 'https://github.com/zhangsan/blog',
    },
  ],
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: defaultResumeData,
      template: 'modern',

      setData: (data) => set({ data }),
      setTemplate: (template) => set({ template }),

      updateField: (field, value) =>
        set((state) => ({
          data: { ...state.data, [field]: value },
        })),

      addExperience: (exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: [...state.data.experience, exp],
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((e) => e.id !== id),
          },
        })),

      addEducation: (edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, edu],
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        })),

      addProject: (project) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [...state.data.projects, project],
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.filter((p) => p.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [...new Set([...state.data.skills, skill])],
          },
        })),

      removeSkill: (skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter((s) => s !== skill),
          },
        })),
    }),
    { name: 'resume-storage' }
  )
)
