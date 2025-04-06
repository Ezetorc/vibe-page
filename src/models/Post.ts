import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { Comment } from './Comment'
import { CommentService } from '../services/CommentService'
import { PostService } from '../services/PostService'

export class Post {
  public id: number
  public userId: number
  public content: string
  public createdAt: string

  constructor ({
    id,
    userId,
    content,
    createdAt
  }: {
    id: number
    userId: number
    content: string
    createdAt: string
  }) {
    this.id = id
    this.userId = userId
    this.content = content
    this.createdAt = createdAt
  }

  public async delete (): Promise<number> {
    return await PostService.delete({ postId: this.id })
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async getComments (): Promise<Comment[]> {
    return await CommentService.getAllOfPost({ postId: this.id })
  }

  public async getLikes (): Promise<Like[]> {
    const likes = await LikeService.getAllOfPost({ postId: this.id })
    const postLikes = likes.filter(like => like.targetId === this.id)

    return postLikes
  }

  public async getLikesAmount (): Promise<number> {
    return await LikeService.getAmountOfPost({ postId: this.id })
  }
}
