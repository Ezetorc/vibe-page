import { NotificationType } from './NotificationType'

export class Notification {
  public senderId: number
  public targetId: number
  public type: NotificationType
  public id: number
  public seen: boolean
  public data?: null | {
    postId?: number
    commentId?: number
  }
  public createdAt: string

  constructor (props: {
    senderId: number
    targetId: number
    type: NotificationType
    id: number
    seen: boolean
    data?: null | {
      postId?: number
      commentId?: number
    }
    createdAt: string
  }) {
    this.senderId = props.senderId
    this.targetId = props.targetId
    this.type = props.type
    this.id = props.id
    this.seen = props.seen
    this.data = props.data
    this.createdAt = props.createdAt
  }
}
