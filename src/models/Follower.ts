export class Follower {
  public followerId: number
  public followingId: number

  constructor ({
    followerId,
    followingId
  }: {
    followerId: number
    followingId: number
  }) {
    this.followerId = followerId
    this.followingId = followingId
  }
}
