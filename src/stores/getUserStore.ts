import { create } from 'zustand'
import { UserStore } from '../models/UserStore'

export const getUserStore = create<UserStore>(set => ({
  user: null,
  setUser: newUser => set({ user: newUser })
}))
