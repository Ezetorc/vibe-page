import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { CommentService } from '../services/CommentService'
import { User } from './User'

export class Comment {
  public id: number
  public postId: number
  public content: string
  public user: User
  public likes: number
  public date: string
  public userLiked: boolean

  constructor (props: {
    id: number
    postId: number
    content: string
    date: string
    user: User
    likes: number
    userLiked: boolean
  }) {
    this.id = props.id
    this.postId = props.postId
    this.content = props.content
    this.user = props.user
    this.date = props.date
    this.likes = props.likes
    this.userLiked = props.userLiked
  }

  public update (properties: Partial<Comment>): Comment {
    return new Comment({
      user: properties.user ?? this.user,
      likes: properties.likes ?? this.likes,
      date: properties.date ?? this.date,
      userLiked: properties.userLiked ?? this.userLiked,
      id: properties.id ?? this.id,
      content: properties.content ?? this.content,
      postId: properties.postId ?? this.postId
    })
  }

  public async delete (params: {
    loggedUser: User | null
  }): Promise<Comment | null> {
    return await CommentService.delete({
      commentId: this.id,
      loggedUser: params.loggedUser
    })
  }

  public async getLikes (): Promise<Like[]> {
    return await LikeService.getAllOfComment({ commentId: this.id })
  }
}
