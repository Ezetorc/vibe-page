import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { CommentEndpoint } from './CommentEndpoint'
import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { Comment } from './Comment'
import { api } from '../constants/SETTINGS'

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

  public async delete (): Promise<boolean> {
    const response = await api.delete<boolean>({
      endpoint: `posts/id?id=${this.id}`
    })

    if (!response.success) return false

    const postLikes = await LikeService.getAllOfPost({ postId: this.id })
    const likesIds = postLikes.map(postLike => postLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return true
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async getComments (): Promise<Comment[]> {
    const response = await api.get<CommentEndpoint[]>({
      endpoint: `comments/all?postId=${this.id}`
    })

    if (!response.success) return []

    const comments = response.value!.map(commentEndpoint =>
      getAdaptedComment({ commentEndpoint })
    )
    return comments
  }

  public async getLikes (): Promise<Like[]> {
    const likes = await LikeService.getAllOfPost({ postId: this.id })
    const postLikes = likes.filter(like => like.targetId === this.id)

    return postLikes
  }

  public async getLikesAmount (): Promise<number> {
    const response = await api.get<number>({
      endpoint: `likes/amount?targetId=${this.id}&type=post`
    })

    if (response.success) {
      return response.value!
    } else {
      return -1
    }
  }
}
