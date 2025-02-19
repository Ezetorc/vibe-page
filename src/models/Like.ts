import { LikeType } from "./LikeType"

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
}
