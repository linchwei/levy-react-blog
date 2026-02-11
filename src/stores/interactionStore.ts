import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface InteractionState {
  likes: Record<string, number>
  favorites: string[]
  likedPosts: string[]
  likePost: (postId: string) => void
  favoritePost: (postId: string) => void
  isFavorited: (postId: string) => boolean
  isLiked: (postId: string) => boolean
  getLikeCount: (postId: string) => number
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set, get) => ({
      likes: {},
      favorites: [],
      likedPosts: [],

      likePost: (postId: string) => {
        const { likedPosts, likes } = get()
        if (!likedPosts.includes(postId)) {
          set({
            likedPosts: [...likedPosts, postId],
            likes: { ...likes, [postId]: (likes[postId] || 0) + 1 },
          })
        }
      },

      favoritePost: (postId: string) => {
        const { favorites } = get()
        if (favorites.includes(postId)) {
          set({ favorites: favorites.filter(id => id !== postId) })
        } else {
          set({ favorites: [...favorites, postId] })
        }
      },

      isFavorited: (postId: string) => get().favorites.includes(postId),

      isLiked: (postId: string) => get().likedPosts.includes(postId),

      getLikeCount: (postId: string) => get().likes[postId] || 0,
    }),
    { name: 'interaction-storage' }
  )
)
