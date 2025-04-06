import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { CommentService } from '../services/CommentService'

export class Comment {
  constructor ({
    id,
    userId,
    postId,
    content,
    createdAt
  }: {
    id: number
    userId: number
    postId: number
    content: string
    createdAt: string
  }) {
    this.id = id
    this.userId = userId
    this.postId = postId
    this.content = content
    this.createdAt = createdAt
  }

  public id: number
  public userId: number
  public postId: number
  public content: string
  public createdAt: string

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async delete (): Promise<Comment | null> {
    return await CommentService.delete({ commentId: this.id })
  }

  public async getLikesAmount (): Promise<number> {
    return await LikeService.getAmountOfComment({ commentId: this.id })
  }

  public async getLikes (): Promise<Like[]> {
    return await LikeService.getAllOfComment({ commentId: this.id })
  }
}
