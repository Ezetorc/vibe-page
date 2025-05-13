import { User } from './User'

export type SimplifiedUser = Omit<User, 'createdAt' | 'description'>

