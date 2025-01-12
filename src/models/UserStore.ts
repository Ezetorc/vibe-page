import { User } from './User'

export interface UserStore {
  user: User | null
  setUser: (newUser: User | null) => void
}
