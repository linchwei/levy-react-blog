import { GitHubCalendar } from 'react-github-calendar'

interface GitHubContributionsProps {
  username: string
}

export function GitHubContributions({ username }: GitHubContributionsProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        GitHub 贡献热力图
      </h3>
      <div className="overflow-x-auto">
        <GitHubCalendar
          username={username}
          blockSize={12}
          blockMargin={4}
          fontSize={14}
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
        />
      </div>
    </div>
  )
}
