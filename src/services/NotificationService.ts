import { NotificationEndpoint } from './../models/NotificationEndpoint'
import { VIBE } from '../constants/VIBE'
import { Notification } from '../models/Notification'
import { NotificationType } from '../models/NotificationType'
import { UserService } from './UserService'

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
    const sender = UserService.getFromEndpoint({
      userEndpoint: params.notificationEndpoint.sender
    })

    return new Notification({
      sender,
      targetId: endpoint.target_id,
      type: endpoint.type,
      id: endpoint.id,
      data,
      seen: endpoint.seen,
      createdAt: endpoint.created_at
    })
  }

  static async markAsSeen (params: {
    notificationsIds: number[]
  }): Promise<boolean> {
    const response = await VIBE.post<boolean>({
      endpoint: 'notifications/seen',
      body: JSON.stringify({ notificationsIds: params.notificationsIds })
    })

    return response.value
  }

  static async loggedUserHasNotifications (): Promise<boolean> {
    const response = await VIBE.get<boolean>({
      endpoint: 'notifications/hasNew'
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

  static async create (params: {
    senderId: number
    targetId: number
    type: NotificationType
    data?: object
  }): Promise<boolean> {
    const response = await VIBE.post<boolean>({
      endpoint: 'notifications',
      body: JSON.stringify({
        sender_id: params.senderId,
        target_id: params.targetId,
        type: params.type,
        data: params.data
      })
    })

    return response.value
  }
}
