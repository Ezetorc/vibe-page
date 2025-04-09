import { create } from 'zustand'
import { UserStore } from '../models/UserStore'

export const getUserStore = create<UserStore>(set => ({
  loggedUser: null,
  setLoggedUser: newLoggedUser => set({ loggedUser: newLoggedUser })
}))
