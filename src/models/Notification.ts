import { NotificationType } from './NotificationType'
import { SimplifiedUser } from './SimplifiedUser'

export class Notification {
  public sender: SimplifiedUser
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
    sender: SimplifiedUser
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
    this.sender = props.sender
    this.targetId = props.targetId
    this.type = props.type
    this.id = props.id
    this.seen = props.seen
    this.data = props.data
    this.createdAt = props.createdAt
  }
}
