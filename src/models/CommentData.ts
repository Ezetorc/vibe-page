import { User } from './User'

export class CommentData {
  public user: User | null
  public likes: number | null
  public date: string | null
  public userLiked: boolean | null
  public id: number | null
  public content: string | null

  constructor (
    props: {
      user?: User | null
      likes?: number | null
      date?: string | null
      userLiked?: boolean | null
      id?: number | null
      content?: string | null
    } = {}
  ) {
    this.user = props.user ?? null
    this.likes = props.likes ?? null
    this.date = props.date ?? null
    this.userLiked = props.userLiked ?? null
    this.id = props.id ?? null
    this.content = props.content ?? null
  }

  static get default () {
    return new CommentData({
      user: null,
      likes: null,
      date: null,
      userLiked: null,
      id: null,
      content: null
    })
  }
}
