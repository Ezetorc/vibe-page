import { UserEndpoint } from './UserEndpoint'

export type SimplifiedUserEndpoint = Omit<UserEndpoint, 'created_at' | 'description'>

