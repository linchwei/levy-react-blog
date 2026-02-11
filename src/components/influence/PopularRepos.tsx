import { useEffect, useState } from 'react'
import { Star, GitFork, ExternalLink } from 'lucide-react'

interface Repo {
  id: number
  name: string
  description: string
  stargazers_count: number
  forks_count: number
  language: string
  html_url: string
}

interface PopularReposProps {
  username: string
}

function RepoCard({ repo }: { repo: Repo }) {
  const languageColors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-500',
    Python: 'bg-green-500',
    Rust: 'bg-orange-500',
    Go: 'bg-cyan-500',
    Java: 'bg-red-500',
    'C++': 'bg-purple-500',
    HTML: 'bg-pink-500',
    CSS: 'bg-indigo-500',
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:border-purple-500/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-foreground truncate pr-4">{repo.name}</h4>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-purple-500 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {repo.description || '暂无描述'}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-500'}`} />
              <span className="text-sm text-muted-foreground">{repo.language}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4" />
            <span>{repo.stargazers_count}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <GitFork className="w-4 h-4" />
            <span>{repo.forks_count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PopularRepos({ username }: PopularReposProps) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`)
        const data = await res.json()
        setRepos(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch repos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [username])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
            <div className="h-24 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        暂无公开仓库
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  )
}
