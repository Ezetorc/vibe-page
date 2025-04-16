import { User } from './User'

export interface SessionStore {
  loggedUser: User | null
  setLoggedUser: (loggedUser: User | null) => void
  isActive: boolean
  setIsActive: (newIsActive: boolean) => void
}
