import { create } from 'zustand'
import { SessionStore } from '../models/SessionStore'

export const getSessionStore = create<SessionStore>(set => ({
  loggedUser: null,
  setLoggedUser: newLoggedUser => set({ loggedUser: newLoggedUser }),
  isActive: false,
  setIsActive: newIsActive => set({ isActive: newIsActive })
}))
