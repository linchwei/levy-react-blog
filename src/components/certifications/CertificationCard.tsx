import { Award, ExternalLink, Calendar } from 'lucide-react'
import type { Certification } from './certificationData'

interface CertificationCardProps {
  certification: Certification
}

export function CertificationCard({ certification }: CertificationCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:border-purple-500/50 transition-colors">
      <div className="flex items-start gap-4">
        {/* Badge */}
        <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
          <Award className="w-8 h-8" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
            {certification.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {certification.issuer}
          </p>

          {/* Dates */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              获得: {certification.issueDate}
            </span>
            {certification.expiryDate && (
              <span>到期: {certification.expiryDate}</span>
            )}
          </div>

          {/* Credential ID */}
          <p className="text-xs text-muted-foreground mb-3">
            证书编号: {certification.credentialId}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {certification.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded text-xs"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Verify Link */}
          <a
            href={certification.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-purple-500 hover:text-purple-600 transition-colors"
          >
            验证证书
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
