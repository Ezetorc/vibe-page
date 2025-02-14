import { format } from '@formkit/tempo'
import { Like } from './Like'
import { LikeService } from '../services/LikeService'
import { CommentEndpoint } from './CommentEndpoint'
import { getAdaptedComment } from '../adapters/getAdaptedComment'
import { Comment } from './Comment'
import { Data } from 'api-responser'
import { api } from '../constants/settings'

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

  public async delete (): Promise<Data<boolean>> {
    const response = await api.delete<boolean>({
      endpoint: `posts/id/${this.id}`
    })

    if (!response.success) return Data.failure()

    const postLikes = await LikeService.getAllOfPost({
      postId: this.id
    })

    if (!postLikes.value) return Data.failure()

    const likesIds = postLikes.value.map(postLike => postLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return response
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  public async getComments (): Promise<Data<Comment[]>> {
    const response = await api.get<CommentEndpoint[]>({
      endpoint: `comments/post/${this.id}`
    })

    if (!response.value) return Data.failure()

    const comments = response.value.map(commentEndpoint =>
      getAdaptedComment({ commentEndpoint })
    )
    return Data.success(comments)
  }

  public async getLikes (): Promise<Data<Like[]>> {
    const likes = await LikeService.getAllOfPost({ postId: this.id })

    if (!likes.value) return Data.failure()

    const postLikes = likes.value.filter(like => like.targetId === this.id)

    return Data.success(postLikes)
  }
}
