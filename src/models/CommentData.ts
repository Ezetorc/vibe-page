import { UserService } from '../services/UserService'
import { Comment } from './Comment'
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

  static async getFromComment (params: {
    comment: Comment
    loggedUser: User | null
  }): Promise<CommentData> {
    const [newCommentUser, newLikes, newUserLiked] = await Promise.all([
      UserService.getById({ userId: params.comment.userId }),
      params.comment.getLikesAmount(),
      params.loggedUser?.hasLikedComment({ commentId: params.comment.id })
    ])

    return new CommentData({
      user: newCommentUser,
      likes: newLikes,
      userLiked: newUserLiked,
      id: params.comment.id,
      date: params.comment.getDate(),
      content: params.comment.content
    })
  }

  public update (properties: Partial<CommentData>): CommentData {
    return new CommentData({
      user: properties.user ?? this.user,
      likes: properties.likes ?? this.likes,
      date: properties.date ?? this.date,
      userLiked: properties.userLiked ?? this.userLiked,
      id: properties.id ?? this.id,
      content: properties.content ?? this.content
    })
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
