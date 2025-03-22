import { Comment } from './Comment'
import { User } from './User'

export class PostData {
  public user: User | null
  public likes: number | null
  public comments: Comment[] | null
  public date: string | null
  public userLiked: boolean | null
  public id: number | null
  public content: string | null

  constructor (
    props: {
      user?: User | null
      likes?: number | null
      comments?: Comment[] | null
      date?: string | null
      userLiked?: boolean | null
      id?: number | null
      content?: string | null
    } = {}
  ) {
    this.user = props.user ?? null
    this.likes = props.likes ?? null
    this.comments = props.comments ?? null
    this.date = props.date ?? null
    this.userLiked = props.userLiked ?? null
    this.id = props.id ?? null
    this.content = props.content ?? null
  }

  static get default () {
    return new PostData({
      user: null,
      likes: null,
      comments: null,
      date: null,
      userLiked: null,
      id: null,
      content: null
    })
  }
}
