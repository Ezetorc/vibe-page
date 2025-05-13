export class UserInteractions {
  public postsAmount: number
  public followersAmount: number
  public followingAmount: number

  constructor (props: {
    postsAmount: number
    followersAmount: number
    followingAmount: number
  }) {
    this.postsAmount = props.postsAmount
    this.followersAmount = props.followersAmount
    this.followingAmount = props.followingAmount
  }

  public update (props: Partial<UserInteractions>): UserInteractions {
    return new UserInteractions({
      postsAmount: props.postsAmount ?? this.postsAmount,
      followersAmount: props.followersAmount ?? this.followersAmount,
      followingAmount: props.followingAmount ?? this.followingAmount
    })
  }
}
