import { User } from './User'

export interface UserStore {
  loggedUser: User | null
  setLoggedUser: (loggedUser: User | null) => void
}
