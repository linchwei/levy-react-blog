import { ThumbsUp, Bookmark } from 'lucide-react'
import { useInteractionStore } from '@/stores/interactionStore'
import { ShareButton } from './ShareButton'

interface InteractionButtonsProps {
  postId: string
  initialLikes?: number
}

export function InteractionButtons({ postId, initialLikes = 0 }: InteractionButtonsProps) {
  const { likePost, favoritePost, isLiked, isFavorited, getLikeCount } = useInteractionStore()
  const currentLikes = getLikeCount(postId) + initialLikes
  const liked = isLiked(postId)
  const favorited = isFavorited(postId)

  return (
    <div className="flex items-center gap-3">
      {/* 点赞按钮 */}
      <button
        onClick={() => likePost(postId)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          liked
            ? 'bg-red-500 text-white'
            : 'bg-muted hover:bg-muted/80 text-foreground'
        }`}
      >
        <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        <span className="font-medium">{currentLikes}</span>
      </button>

      {/* 收藏按钮 */}
      <button
        onClick={() => favoritePost(postId)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          favorited
            ? 'bg-yellow-500 text-white'
            : 'bg-muted hover:bg-muted/80 text-foreground'
        }`}
        title={favorited ? '取消收藏' : '收藏文章'}
      >
        <Bookmark className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
      </button>

      {/* 分享按钮 */}
      <ShareButton postId={postId} />
    </div>
  )
}
