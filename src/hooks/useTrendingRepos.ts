import { useState, useEffect, useCallback } from 'react'

export interface TrendingRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string
  created_at: string
  updated_at: string
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
}

interface UseTrendingReposOptions {
  language?: string
  since?: 'daily' | 'weekly' | 'monthly'
  perPage?: number
  page?: number
}

interface UseTrendingReposReturn {
  repos: TrendingRepo[]
  loading: boolean
  error: string | null
  refetch: () => void
  page: number
  setPage: (page: number) => void
  totalCount: number
  hasMore: boolean
}

// 模拟数据（当 API 受限时使用）
const mockTrendingRepos: TrendingRepo[] = [
  {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 231000,
    forks_count: 47000,
    language: 'TypeScript',
    created_at: '2013-05-24T16:15:54Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
      html_url: 'https://github.com/facebook'
    }
  },
  {
    id: 2,
    name: 'vue',
    full_name: 'vuejs/vue',
    description: 'Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
    html_url: 'https://github.com/vuejs/vue',
    stargazers_count: 207000,
    forks_count: 34000,
    language: 'TypeScript',
    created_at: '2013-07-29T03:24:51Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'vuejs',
      avatar_url: 'https://avatars.githubusercontent.com/u/6128107?v=4',
      html_url: 'https://github.com/vuejs'
    }
  },
  {
    id: 3,
    name: 'next.js',
    full_name: 'vercel/next.js',
    description: 'The React Framework for the Web',
    html_url: 'https://github.com/vercel/next.js',
    stargazers_count: 123000,
    forks_count: 26000,
    language: 'TypeScript',
    created_at: '2016-10-05T23:32:51Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'vercel',
      avatar_url: 'https://avatars.githubusercontent.com/u/14985020?v=4',
      html_url: 'https://github.com/vercel'
    }
  },
  {
    id: 4,
    name: 'three.js',
    full_name: 'mrdoob/three.js',
    description: 'JavaScript 3D Library.',
    html_url: 'https://github.com/mrdoob/three.js',
    stargazers_count: 102000,
    forks_count: 35000,
    language: 'JavaScript',
    created_at: '2010-03-23T18:58:01Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'mrdoob',
      avatar_url: 'https://avatars.githubusercontent.com/u/97088?v=4',
      html_url: 'https://github.com/mrdoob'
    }
  },
  {
    id: 5,
    name: 'shadcn-ui',
    full_name: 'shadcn-ui/ui',
    description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    html_url: 'https://github.com/shadcn-ui/ui',
    stargazers_count: 65000,
    forks_count: 3500,
    language: 'TypeScript',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'shadcn-ui',
      avatar_url: 'https://avatars.githubusercontent.com/u/139895814?v=4',
      html_url: 'https://github.com/shadcn-ui'
    }
  },
  {
    id: 6,
    name: 'framer-motion',
    full_name: 'framer/motion',
    description: 'Open source, production-ready animation and gesture library for React',
    html_url: 'https://github.com/framer/motion',
    stargazers_count: 23000,
    forks_count: 800,
    language: 'TypeScript',
    created_at: '2018-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'framer',
      avatar_url: 'https://avatars.githubusercontent.com/u/42876?v=4',
      html_url: 'https://github.com/framer'
    }
  },
  {
    id: 7,
    name: 'axios',
    full_name: 'axios/axios',
    description: 'Promise based HTTP client for the browser and node.js',
    html_url: 'https://github.com/axios/axios',
    stargazers_count: 105000,
    forks_count: 10900,
    language: 'JavaScript',
    created_at: '2014-08-18T16:21:25Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'axios',
      avatar_url: 'https://avatars.githubusercontent.com/u/32372333?v=4',
      html_url: 'https://github.com/axios'
    }
  },
  {
    id: 8,
    name: 'vite',
    full_name: 'vitejs/vite',
    description: 'Next generation frontend tooling. Fast.',
    html_url: 'https://github.com/vitejs/vite',
    stargazers_count: 69000,
    forks_count: 6200,
    language: 'TypeScript',
    created_at: '2020-04-21T14:08:27Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'vitejs',
      avatar_url: 'https://avatars.githubusercontent.com/u/65625612?v=4',
      html_url: 'https://github.com/vitejs'
    }
  },
  {
    id: 9,
    name: 'tailwindcss',
    full_name: 'tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development.',
    html_url: 'https://github.com/tailwindlabs/tailwindcss',
    stargazers_count: 82000,
    forks_count: 4200,
    language: 'TypeScript',
    created_at: '2017-10-06T14:08:40Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'tailwindlabs',
      avatar_url: 'https://avatars.githubusercontent.com/u/67109815?v=4',
      html_url: 'https://github.com/tailwindlabs'
    }
  },
  {
    id: 10,
    name: 'react-query',
    full_name: 'TanStack/query',
    description: 'Powerful asynchronous state management for TS/JS, React, Solid, Vue and Svelte',
    html_url: 'https://github.com/TanStack/query',
    stargazers_count: 42000,
    forks_count: 2800,
    language: 'TypeScript',
    created_at: '2019-08-23T14:27:34Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'TanStack',
      avatar_url: 'https://avatars.githubusercontent.com/u/72518640?v=4',
      html_url: 'https://github.com/TanStack'
    }
  },
  {
    id: 11,
    name: 'zustand',
    full_name: 'pmndrs/zustand',
    description: '🐻 Bear necessities for state management in React',
    html_url: 'https://github.com/pmndrs/zustand',
    stargazers_count: 45000,
    forks_count: 1400,
    language: 'TypeScript',
    created_at: '2019-05-03T14:56:53Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'pmndrs',
      avatar_url: 'https://avatars.githubusercontent.com/u/45790596?v=4',
      html_url: 'https://github.com/pmndrs'
    }
  },
  {
    id: 12,
    name: 'storybook',
    full_name: 'storybookjs/storybook',
    description: 'Storybook is a frontend workshop for building UI components and pages in isolation.',
    html_url: 'https://github.com/storybookjs/storybook',
    stargazers_count: 84000,
    forks_count: 9200,
    language: 'TypeScript',
    created_at: '2016-03-18T17:17:14Z',
    updated_at: '2024-01-01T00:00:00Z',
    owner: {
      login: 'storybookjs',
      avatar_url: 'https://avatars.githubusercontent.com/u/22632046?v=4',
      html_url: 'https://github.com/storybookjs'
    }
  }
]

export function useTrendingRepos(options: UseTrendingReposOptions = {}): UseTrendingReposReturn {
  const { 
    language = 'typescript', 
    since = 'weekly', 
    perPage = 9,
    page: initialPage = 1
  } = options
  
  const [repos, setRepos] = useState<TrendingRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useMockData, setUseMockData] = useState(false)
  const [page, setPage] = useState(initialPage)
  const [totalCount, setTotalCount] = useState(0)

  const fetchTrending = useCallback(async (targetPage: number = page) => {
    setLoading(true)
    setError(null)

    try {
      // 如果之前使用过模拟数据，直接使用
      if (useMockData) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        const start = (targetPage - 1) * perPage
        const end = start + perPage
        setRepos(mockTrendingRepos.slice(start, end))
        setTotalCount(mockTrendingRepos.length)
        setLoading(false)
        return
      }

      // 计算时间范围
      const now = new Date()
      let sinceDate = new Date()
      
      switch (since) {
        case 'daily':
          sinceDate.setDate(now.getDate() - 1)
          break
        case 'weekly':
          sinceDate.setDate(now.getDate() - 7)
          break
        case 'monthly':
          sinceDate.setMonth(now.getMonth() - 1)
          break
      }
      
      const dateStr = sinceDate.toISOString().split('T')[0]

      // GitHub Search API - 添加分页参数
      const response = await fetch(
        `https://api.github.com/search/repositories?q=language:${language}+created:>${dateStr}&sort=stars&order=desc&per_page=${perPage}&page=${targetPage}`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            // 如果有 GitHub Token，可以取消注释下面这行
            // 'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`
          }
        }
      )

      if (response.status === 403) {
        // API 限流，切换到模拟数据
        console.warn('GitHub API rate limited, using mock data')
        setUseMockData(true)
        const start = (targetPage - 1) * perPage
        const end = start + perPage
        setRepos(mockTrendingRepos.slice(start, end))
        setTotalCount(mockTrendingRepos.length)
        return
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data = await response.json()
      
      // 如果返回数据为空，使用模拟数据
      if (!data.items || data.items.length === 0) {
        const start = (targetPage - 1) * perPage
        const end = start + perPage
        setRepos(mockTrendingRepos.slice(start, end))
        setTotalCount(mockTrendingRepos.length)
      } else {
        setRepos(data.items)
        // GitHub API 返回的总数可能超过1000，这里做限制
        setTotalCount(Math.min(data.total_count || 0, 1000))
      }
    } catch (err) {
      console.error('Failed to fetch trending repos:', err)
      // 出错时使用模拟数据
      setUseMockData(true)
      const start = (targetPage - 1) * perPage
      const end = start + perPage
      setRepos(mockTrendingRepos.slice(start, end))
      setTotalCount(mockTrendingRepos.length)
    } finally {
      setLoading(false)
    }
  }, [language, since, perPage, page, useMockData])

  // 当页码改变时获取数据
  useEffect(() => {
    fetchTrending(page)
  }, [fetchTrending, page])

  // 当筛选条件改变时重置页码
  useEffect(() => {
    setPage(1)
  }, [language, since])

  const handleSetPage = useCallback((newPage: number) => {
    setPage(newPage)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const hasMore = page * perPage < totalCount

  return { 
    repos, 
    loading, 
    error,
    refetch: () => fetchTrending(page),
    page,
    setPage: handleSetPage,
    totalCount,
    hasMore
  }
}
