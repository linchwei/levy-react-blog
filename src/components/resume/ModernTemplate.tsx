import type { ResumeData } from '@/stores/resumeStore'
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Code, Folder } from 'lucide-react'

interface ModernTemplateProps {
  data: ResumeData
}

export function ModernTemplate({ data }: ModernTemplateProps) {
  return (
    <div className="bg-white text-slate-900 p-8 min-h-[297mm] w-[210mm] mx-auto shadow-lg">
      {/* Header */}
      <header className="border-b-2 border-purple-500 pb-6 mb-6">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{data.name}</h1>
        <p className="text-xl text-purple-600 mb-4">{data.title}</p>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          {data.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{data.location}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{data.website}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-purple-500 rounded" />
            个人简介
          </h2>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-500" />
            工作经历
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-slate-200 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-slate-900">{exp.position}</h3>
                  <span className="text-sm text-slate-500">{exp.duration}</span>
                </div>
                <p className="text-purple-600 text-sm mb-1">{exp.company}</p>
                <p className="text-slate-700 text-sm">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-500" />
            教育背景
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="border-l-2 border-slate-200 pl-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-slate-900">{edu.school}</h3>
                  <span className="text-sm text-slate-500">{edu.duration}</span>
                </div>
                <p className="text-slate-700 text-sm">{edu.degree}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-purple-500" />
            技能专长
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Folder className="w-5 h-5 text-purple-500" />
            项目经历
          </h2>
          <div className="space-y-3">
            {data.projects.map((project) => (
              <div key={project.id} className="border-l-2 border-slate-200 pl-4">
                <h3 className="font-semibold text-slate-900">{project.name}</h3>
                <p className="text-slate-700 text-sm mb-1">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    className="text-purple-600 text-sm hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
