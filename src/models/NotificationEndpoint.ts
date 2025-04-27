import { NotificationType } from './NotificationType'

export interface NotificationEndpoint {
  sender_id: number
  target_id: number
  type: NotificationType
  id: number
  data?: null | {
    post_id?: number
    comment_id?: number
  }
  created_at: string
  seen: boolean
}
