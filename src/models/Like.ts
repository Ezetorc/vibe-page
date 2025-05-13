import { NotificationService } from '../services/NotificationService'
import { Comment } from './Comment'
import { LikeType } from './LikeType'
import { Post } from './Post'
import { User } from './User'

export class Like {
  public id: number
  public targetId: number
  public userId: number
  public type: LikeType

  constructor ({
    id,
    targetId,
    type,
    userId
  }: {
    id: number
    targetId: number
    userId: number
    type: LikeType
  }) {
    this.id = id
    this.type = type
    this.targetId = targetId
    this.userId = userId
  }

  public async createNotification (params: {
    sender: User
    target: Post | Comment
  }): Promise<boolean> {
    const type: LikeType = params.target instanceof Comment ? 'comment' : 'post'
    return await NotificationService.create({
      senderId: params.sender.id,
      targetId: params.target.user.id,
      type: 'like',
      data: {
        ...(type === 'comment' && {
          comment_id: params.target.id
        }),
        ...(type === 'post' && { post_id: params.target.id })
      }
    })
  }
}
