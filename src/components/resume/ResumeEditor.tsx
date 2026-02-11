import { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { ResumeData, Experience, Education, Project } from '@/stores/resumeStore'

interface ResumeEditorProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
}

export function ResumeEditor({ data, onChange }: ResumeEditorProps) {
  const [newSkill, setNewSkill] = useState('')

  const updateField = (field: keyof ResumeData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      duration: '',
      description: '',
    }
    onChange({ ...data, experience: [...data.experience, newExp] })
  }

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    })
  }

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    })
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      duration: '',
    }
    onChange({ ...data, education: [...data.education, newEdu] })
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    })
  }

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    })
  }

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      link: '',
    }
    onChange({ ...data, projects: [...data.projects, newProject] })
  }

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange({
      ...data,
      projects: data.projects.map((project) =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    })
  }

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((project) => project.id !== id),
    })
  }

  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      onChange({ ...data, skills: [...data.skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">基本信息</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="请输入姓名"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">职位</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="请输入职位"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="请输入邮箱"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">电话</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="请输入电话"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">地点</Label>
            <Input
              id="location"
              value={data.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="请输入地点"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">个人网站</Label>
            <Input
              id="website"
              value={data.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="请输入个人网站"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="summary">个人简介</Label>
          <Textarea
            id="summary"
            value={data.summary}
            onChange={(e) => updateField('summary', e.target.value)}
            placeholder="请输入个人简介"
            rows={4}
          />
        </div>
      </section>

      {/* Experience */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">工作经历</h3>
          <Button variant="outline" size="sm" onClick={addExperience}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="公司名称"
                  />
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="职位"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={exp.duration}
                onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                placeholder="时间段，如：2021.06 - 至今"
              />
              <Textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="工作描述"
                rows={2}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">教育背景</h3>
          <Button variant="outline" size="sm" onClick={addEducation}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="学校名称"
                  />
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="学位"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Input
                value={edu.duration}
                onChange={(e) => updateEducation(edu.id, 'duration', e.target.value)}
                placeholder="时间段，如：2015.09 - 2019.06"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">技能专长</h3>
        <div className="flex gap-2 mb-4">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="输入技能，如：React"
            onKeyDown={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">项目经历</h3>
          <Button variant="outline" size="sm" onClick={addProject}>
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        </div>
        <div className="space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="p-4 bg-muted rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1">
                  <Input
                    value={project.name}
                    onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                    placeholder="项目名称"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                placeholder="项目描述"
                rows={2}
              />
              <Input
                value={project.link}
                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                placeholder="项目链接（可选）"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
