export class Like {
  public id: number
  public targetId: number
  public userId: number
  public type: 'post' | 'comment'

  constructor ({
    id,
    targetId,
    type,
    userId
  }: {
    id: number
    targetId: number
    userId: number
    type: 'post' | 'comment'
  }) {
    this.id = id
    this.type = type
    this.targetId = targetId
    this.userId = userId
  }
}
