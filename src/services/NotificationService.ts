import { VIBE } from '../constants/VIBE'
import { NotificationEndpoint } from '../models/NotificationEndpoint'
import { Notification } from '../models/Notification'

export class NotificationService {
  static getFromEndpoint (params: {
    notificationEndpoint: NotificationEndpoint
  }): Notification {
    const endpoint = params.notificationEndpoint

    const data = endpoint.data
      ? {
          postId: endpoint.data.post_id,
          commentId: endpoint.data.comment_id
        }
      : null

    return new Notification({
      senderId: endpoint.sender_id,
      targetId: endpoint.target_id,
      type: endpoint.type,
      id: endpoint.id,
      data,
      seen: endpoint.seen,
      createdAt: endpoint.created_at
    })
  }

  static async markAsSeen (params: {
    notificationIds: number[]
  }): Promise<boolean> {
    const response = await VIBE.post<boolean>({
      endpoint: 'notifications/seen',
      body: JSON.stringify({ notificationIds: params.notificationIds })
    })

    return response.value
  }

  static async getAll (params: {
    amount?: number
    page?: number
    senderId?: number
  }): Promise<Notification[]> {
    const endpoint = params.senderId
      ? `notifications/?amount=${params.amount ?? 6}&page=${
          params.page ?? 1
        }&userId=${params.senderId}`
      : `notifications/?amount=${params.amount ?? 6}&page=${params.page ?? 1}`
    const response = await VIBE.get<NotificationEndpoint[]>({ endpoint })

    return response.value.map(notificationEndpoint =>
      this.getFromEndpoint({ notificationEndpoint })
    )
  }

  static async clearAllOfUser (params: { userId: number }): Promise<boolean> {
    const response = await VIBE.delete<boolean>({
      endpoint: `notifications?targetId=${params.userId}`
    })

    return !response.error
  }
}
