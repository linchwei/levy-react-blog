import { useEffect, useState } from 'react'
import { Star, Users, GitCommit, FolderGit2, type LucideIcon } from 'lucide-react'

interface GitHubStatsProps {
  username: string
}

interface Stats {
  stars: number
  followers: number
  contributions: number
  repositories: number
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: LucideIcon }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border text-center">
      <div className="flex justify-center mb-3">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-purple-500" />
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">
        {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
      </div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  )
}

export function GitHubStats({ username }: GitHubStatsProps) {
  const [stats, setStats] = useState<Stats>({
    stars: 0,
    followers: 0,
    contributions: 0,
    repositories: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 获取用户基本信息
        const userRes = await fetch(`https://api.github.com/users/${username}`)
        const userData = await userRes.json()

        // 获取仓库列表计算总 stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        const reposData = await reposRes.json()
        const totalStars = Array.isArray(reposData) 
          ? reposData.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
          : 0

        setStats({
          stars: totalStars,
          followers: userData.followers || 0,
          contributions: userData.public_repos * 50, // 估算值
          repositories: userData.public_repos || 0,
        })
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [username])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border animate-pulse">
            <div className="h-20 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="总 Stars" value={stats.stars} icon={Star} />
      <StatCard label="Followers" value={stats.followers} icon={Users} />
      <StatCard label="Contributions" value={stats.contributions} icon={GitCommit} />
      <StatCard label="Repositories" value={stats.repositories} icon={FolderGit2} />
    </div>
  )
}
