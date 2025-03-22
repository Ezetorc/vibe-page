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
