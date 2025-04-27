import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { Comment } from './Comment'
import { PostService } from '../services/PostService'
import { User } from './User'

export class Post {
  public id: number
  public user: User
  public content: string
  public likes: number
  public comments: Comment[] | number
  public date: string
  public userLiked: boolean

  constructor (props: {
    id: number
    user: User
    content: string
    date: string
    likes: number
    comments: Comment[] | number
    userLiked: boolean
  }) {
    this.id = props.id
    this.user = props.user
    this.content = props.content
    this.date = props.date
    this.likes = props.likes
    this.comments = props.comments
    this.userLiked = props.userLiked
  }

  public update (properties: Partial<Post>): Post {
    return new Post({
      user: properties.user ?? this.user,
      likes: properties.likes ?? this.likes,
      comments: properties.comments ?? this.comments,
      date: properties.date ?? this.date,
      userLiked: properties.userLiked ?? this.userLiked,
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
