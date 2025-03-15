import { User } from '../../../models/User'

export interface AccountData {
  user: User | null
  isUser: boolean
  postsAmount: number
  followersAmount: number
  followingAmount: number
  isLoading: boolean
  isError: boolean
}
