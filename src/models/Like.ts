export class Like {
  public id: number
  public postId: number
  public userId: number

  constructor ({
    id,
    postId,
    userId
  }: {
    id: number
    postId: number
    userId: number
  }) {
    this.id = id
    this.postId = postId
    this.userId = userId
  }
}
