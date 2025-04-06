import { User } from '../../../models/User'

export class UserData {
  public id: number | null
  public name: string | null
  public imageId: string | null
  public imageUrl: string | null
  public description: string | null
  public date: string | null
  public postsAmount: number | null
  public followersAmount: number | null
  public followingAmount: number | null
  public isLogged: boolean | null
  public user: User | null

  constructor (
    props: {
      id?: number | null
      name?: string | null
      imageId?: string | null
      imageUrl?: string | null
      description?: string | null
      date?: string | null
      postsAmount?: number | null
      followersAmount?: number | null
      followingAmount?: number | null
      isLogged?: boolean | null
      user?: User | null
    } = {}
  ) {
    this.id = props.id ?? null
    this.name = props.name ?? null
    this.imageId = props.imageId ?? null
    this.imageUrl = props.imageUrl ?? null
    this.description = props.description ?? null
    this.date = props.date ?? null
    this.postsAmount = props.postsAmount ?? null
    this.followersAmount = props.followersAmount ?? null
    this.followingAmount = props.followingAmount ?? null
    this.isLogged = props.isLogged ?? null
    this.user = props.user ?? null
  }

  static async getFromUser (params: {
    user: User
    isLogged: boolean
  }): Promise<UserData> {
    return new UserData({
      id: params.user.id,
      user: params.user,
      name: params.user.name,
      imageId: params.user.imageId,
      imageUrl: params.user.imageUrl,
      description: params.user.description,
      date: params.user.getDate(),
      postsAmount: await params.user.getPostsAmount(),
      followersAmount: await params.user.getFollowersAmount(),
      followingAmount: await params.user.getFollowingAmount(),
      isLogged: params.isLogged
    })
  }

  public update (properties: Partial<UserData>): UserData {
    return new UserData({
      id: properties.id ?? this.id,
      user: properties.user ?? this.user,
      name: properties.name ?? this.name,
      imageId: properties.imageId ?? this.imageId,
      imageUrl: properties.imageUrl ?? this.imageUrl,
      description: properties.description ?? this.description,
      date: properties.date ?? this.date,
      postsAmount: properties.postsAmount ?? this.postsAmount,
      followersAmount: properties.followersAmount ?? this.followersAmount,
      followingAmount: properties.followingAmount ?? this.followingAmount,
      isLogged: properties.isLogged ?? this.isLogged
    })
  }

  static get default () {
    return new UserData({
      id: null,
      name: null,
      imageId: null,
      imageUrl: null,
      description: null,
      date: null,
      postsAmount: null,
      followersAmount: null,
      followingAmount: null,
      isLogged: null
    })
  }
}
