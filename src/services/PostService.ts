import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'
import { api } from '../constants/settings'
import { Data } from '../models/Data'
import { LikeService } from './LikeService'

export class PostService {
  static async create ({
    userId,
    content
  }: {
    userId: number
    content: string
  }): Promise<Data<boolean>> {
    const response = api.post<boolean>({
      endpoint: 'posts',
      body: JSON.stringify({ user_id: userId, content })
    })

    return response
  }

  static async delete ({ postId }: { postId: number }): Promise<Data<number>> {
    const response = await api.delete<boolean>({
      endpoint: `posts/id/${postId}`
    })

    if (!response.success) return Data.failure()

    const postLikes = await LikeService.getAllOfPost({ postId })

    if (!postLikes.value) return Data.failure()

    const likesIds = postLikes.value.map(postLike => postLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return Data.success(postId)
  }

  static async getAll ({
    amount = 6,
    page = 1
  }: {
    amount?: number
    page?: number
  } = {}): Promise<Data<Post[]>> {
    const response = await api.get<PostEndpoint[]>({
      endpoint: `posts?amount=${amount}&page=${page}`
    })

    if (!response.value) return Data.failure()

    const posts = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return Data.success(posts)
  }

  static async getById ({ postId }: { postId: number }): Promise<Data<Post>> {
    const response = await api.get<PostEndpoint>({
      endpoint: `posts/id/${postId}`
    })

    if (!response.value) return Data.failure()

    const post = getAdaptedPost({ postEndpoint: response.value })

    return Data.success(post)
  }

  static async search ({ query }: { query: string }): Promise<Data<Post[]>> {
    const response = await api.get<PostEndpoint[]>({
      endpoint: `posts/search/${encodeURIComponent(query)}`
    })

    if (!response.value) return Data.failure()

    const posts = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return Data.success(posts)
  }
}
