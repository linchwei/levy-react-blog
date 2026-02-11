import Giscus from '@giscus/react'

interface GiscusCommentsProps {
  postSlug: string
}

// 注意：使用 Giscus 需要先在 GitHub 上配置 Discussion 仓库
// 请替换以下配置为你自己的 Giscus 配置
const GISCUS_CONFIG = {
  repo: 'linchwei/levy-react-blog' as `${string}/${string}`,
  repoId: 'YOUR_REPO_ID', // 需要从 Giscus 配置页面获取
  category: 'Announcements',
  categoryId: 'YOUR_CATEGORY_ID', // 需要从 Giscus 配置页面获取
}

export function GiscusComments({ postSlug }: GiscusCommentsProps) {
  // 如果配置未设置，显示提示信息
  if (GISCUS_CONFIG.repoId === 'YOUR_REPO_ID') {
    return (
      <div className="mt-12 p-6 bg-muted rounded-xl border border-border">
        <p className="text-muted-foreground text-center">
          💬 评论功能需要配置 Giscus
          <br />
          <span className="text-sm">
            请访问{' '}
            <a
              href="https://giscus.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:underline"
            >
              giscus.app
            </a>{' '}
            获取配置信息
          </span>
        </p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold text-foreground mb-6">评论</h3>
      <Giscus
        repo={GISCUS_CONFIG.repo}
        repoId={GISCUS_CONFIG.repoId}
        category={GISCUS_CONFIG.category}
        categoryId={GISCUS_CONFIG.categoryId}
        mapping="specific"
        term={postSlug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  )
}
