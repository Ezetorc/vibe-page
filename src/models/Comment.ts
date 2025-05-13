import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { CommentService } from '../services/CommentService'
import { User } from './User'
import { NotificationService } from '../services/NotificationService'
import { Post } from './Post'
import { SimplifiedUser } from './SimplifiedUser'

export class Comment {
  public id: number
  public postId: number
  public content: string
  public user: SimplifiedUser
  public likes: number
  public date: string

  constructor (props: {
    id: number
    postId: number
    content: string
    date: string
    user: User
    likes: number
  }) {
    this.id = props.id
    this.postId = props.postId
    this.content = props.content
    this.user = props.user
    this.date = props.date
    this.likes = props.likes
  }

  public async createNotification (params: { post: Post; sender: User }) {
    return await NotificationService.create({
      senderId: params.sender.id,
      targetId: params.post.user.id,
      type: 'comment',
      data: {
        post_id: params.post.id,
        comment_id: this.id
      }
    })
  }

  public update (properties: Partial<Comment>): Comment {
    return new Comment({
      user: properties.user ?? this.user,
      likes: properties.likes ?? this.likes,
      date: properties.date ?? this.date,
      id: properties.id ?? this.id,
      content: properties.content ?? this.content,
      postId: properties.postId ?? this.postId
    })
  }

  public async delete (): Promise<number> {
    return await CommentService.delete({
      commentId: this.id
    })
  }

  public async getLikes (): Promise<Like[]> {
    return await LikeService.getAllOfComment({ commentId: this.id })
  }
}
