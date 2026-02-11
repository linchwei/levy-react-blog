import { useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useOnlineStore } from '@/stores/onlineStore'

export function OnlineStatusIndicator() {
  const { status, setOnline, updateLastActive } = useOnlineStore()

  useEffect(() => {
    // 检测在线状态
    const handleOnline = () => {
      setOnline(true)
      updateLastActive()
    }

    const handleOffline = () => {
      setOnline(false)
    }

    const handleActivity = () => {
      updateLastActive()
    }

    // 初始状态
    setOnline(navigator.onLine)

    // 监听网络状态
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 监听用户活动
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('click', handleActivity)
    window.addEventListener('scroll', handleActivity)

    // 定期更新最后活跃时间
    const interval = setInterval(() => {
      updateLastActive()
    }, 60000) // 每分钟更新一次

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      clearInterval(interval)
    }
  }, [setOnline, updateLastActive])

  const lastActiveText = formatDistanceToNow(new Date(status.lastActive), {
    addSuffix: true,
    locale: zhCN,
  })

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={`w-2.5 h-2.5 rounded-full ${
          status.isOnline
            ? 'bg-green-500 animate-pulse'
            : 'bg-gray-400'
        }`}
      />
      <span className="text-muted-foreground">
        {status.isOnline ? (
          <>
            在线
            {status.currentActivity && (
              <span className="text-blue-500 ml-1">
                - {status.currentActivity}
              </span>
            )}
          </>
        ) : (
          `最后活跃: ${lastActiveText}`
        )}
      </span>
    </div>
  )
}
