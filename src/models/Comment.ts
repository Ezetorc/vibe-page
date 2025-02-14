import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeEndpoint } from './LikeEndpoint'
import { getAdaptedLike } from '../adapters/getAdaptedLike'
import { api } from '../constants/settings'
import { Data } from 'api-responser'
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
  
  public async delete (): Promise<Data<boolean>> {
    const response = await api.delete<boolean>({
      endpoint: `comments/id/${this.id}`
    })

    if (!response.success) return Data.failure()

    const commentLikes = await LikeService.getAllOfComment({
      commentId: this.id
    })

    if (!commentLikes.value) return Data.failure()

    const likesIds = commentLikes.value.map(commentLike => commentLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return response
  }

  public async getLikes (): Promise<Data<Like[]>> {
    const response = await api.get<LikeEndpoint[]>({
      endpoint: `likes/comments/id/${this.id}`
    })

    if (!response.value) return Data.failure()

    const likes = response.value.map(likeEndpoint =>
      getAdaptedLike({ likeEndpoint })
    )

    return Data.success(likes)
  }
}
