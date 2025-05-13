import { NotificationType } from './NotificationType'
import { SimplifiedUserEndpoint } from './SimplifiedUserEndpoint'

export interface NotificationEndpoint {
  id: number
  sender: SimplifiedUserEndpoint
  target_id: number
  type: NotificationType
  data?: {
    post_id?: number
    comment_id?: number
  }
  created_at: string
  seen: boolean
}
