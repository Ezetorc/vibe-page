import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { Comment } from './Comment'
import { PostService } from '../services/PostService'
import { User } from './User'
import { NotificationService } from '../services/NotificationService'
import { SimplifiedUser } from './SimplifiedUser'

export class Post {
  public id: number
  public user: SimplifiedUser
  public content: string
  public likes: number
  public comments: Comment[] | number
  public date: string

  constructor (props: {
    id: number
    user: User
    content: string
    date: string
    likes: number
    comments: Comment[] | number
  }) {
    this.id = props.id
    this.user = props.user
    this.content = props.content
    this.date = props.date
    this.likes = props.likes
    this.comments = props.comments
  }

  public async createNotification (params: { owner: User; followerId: number }) {
    return await NotificationService.create({
      senderId: params.owner.id,
      targetId: params.followerId,
      type: 'post',
      data: {
        post_id: this.id
      }
    })
  }

  public update (properties: Partial<Post>): Post {
    return new Post({
      user: properties.user ?? this.user,
      likes: properties.likes ?? this.likes,
      comments: properties.comments ?? this.comments,
      date: properties.date ?? this.date,
      id: properties.id ?? this.id,
      content: properties.content ?? this.content
    })
  }

  public async delete (): Promise<number> {
    return await PostService.delete({ postId: this.id })
  }

  public async getLikes (): Promise<Like[]> {
    const likes = await LikeService.getAllOfPost({ postId: this.id })
    const postLikes = likes.filter(like => like.targetId === this.id)

    return postLikes
  }
}
