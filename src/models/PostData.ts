import { UserService } from '../services/UserService'
import { Comment } from './Comment'
import { Post } from './Post'
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

  static async getFromPost (params: {
    post: Post
    loggedUser: User | null
  }): Promise<PostData> {
    const [newUser, newLikes, newComments, newUserLiked] = await Promise.all([
      UserService.getById({ userId: params.post.userId }),
      params.post.getLikesAmount(),
      params.post.getComments(),
      params.loggedUser?.hasLikedPost({ postId: params.post.id })
    ])

    return new PostData({
      user: newUser,
      likes: newLikes,
      comments: newComments,
      userLiked: Boolean(newUserLiked),
      id: params.post.id,
      date: params.post.getDate(),
      content: params.post.content
    })
  }

  public update (properties: Partial<PostData>): PostData {
    return new PostData({
      user: properties.user ?? this.user,
      likes: properties.likes ?? this.likes,
      comments: properties.comments ?? this.comments,
      date: properties.date ?? this.date,
      userLiked: properties.userLiked ?? this.userLiked,
      id: properties.id ?? this.id,
      content: properties.content ?? this.content
    })
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
