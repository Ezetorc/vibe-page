import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeEndpoint } from './LikeEndpoint'
import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { api } from '../constants/SETTINGS'
import { LikeService } from '../services/LikeService'

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

  public async delete (): Promise<boolean> {
    const response = await api.delete<boolean>({
      endpoint: `comments?id=${this.id}`
    })

    if (!response.success) return false

    const commentLikes = await LikeService.getAllOfComment({
      commentId: this.id
    })
    const likesIds = commentLikes.map(commentLike => commentLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return true
  }

  public async getLikes (): Promise<Like[]> {
    const response = await api.get<LikeEndpoint[]>({
      endpoint: `likes/all?id=${this.id}&type=comment`
    })

    if (!response.success) return []

    const likes = response.value!.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return likes
  }
}
