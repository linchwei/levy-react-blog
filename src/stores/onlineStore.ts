import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface OnlineStatus {
  isOnline: boolean
  lastActive: string
  currentActivity: string
}

interface OnlineState {
  status: OnlineStatus
  setOnline: (isOnline: boolean) => void
  setActivity: (activity: string) => void
  updateLastActive: () => void
}

const defaultStatus: OnlineStatus = {
  isOnline: false,
  lastActive: new Date().toISOString(),
  currentActivity: '',
}

export const useOnlineStore = create<OnlineState>()(
  persist(
    (set) => ({
      status: defaultStatus,

      setOnline: (isOnline: boolean) =>
        set((state) => ({
          status: { ...state.status, isOnline },
        })),

      setActivity: (activity: string) =>
        set((state) => ({
          status: { ...state.status, currentActivity: activity },
        })),

      updateLastActive: () =>
        set((state) => ({
          status: { ...state.status, lastActive: new Date().toISOString() },
        })),
    }),
    { name: 'online-status' }
  )
)
