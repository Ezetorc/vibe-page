import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'
import { LikeService } from './LikeService'
import { VIBE } from '../constants/VIBE'

export class PostService {
  static async create (params: {
    userId: number
    content: string
  }): Promise<Post | null> {
    const response = await VIBE.post<PostEndpoint>({
      endpoint: 'posts',
      body: JSON.stringify({ content: params.content })
    })

    if (!response.success) return null

    const post = getAdaptedPost({ postEndpoint: response.value! })

    return post
  }

  static async delete (params: { postId: number }): Promise<number> {
    const response = await VIBE.delete<boolean>({
      endpoint: `posts/${params.postId}`
    })

    if (!response.success) return -1

    const postLikes = await LikeService.getAllOfPost({ postId: params.postId })

    if (!postLikes) return -1

    const likesIds = postLikes.map(postLike => postLike.id)

    await Promise.all(likesIds.map(likeId => LikeService.delete({ likeId })))

    return params.postId
  }

  static async getAll (
    params: {
      amount?: number
      page?: number
      userId?: number
    } = {}
  ): Promise<Post[]> {
    const endpoint = params.userId
      ? `posts/?amount=${params.amount ?? 6}&page=${params.page ?? 1}&userId=${
          params.userId
        }`
      : `posts/?amount=${params.amount ?? 6}&page=${params.page ?? 1}`
    const response = await VIBE.get<PostEndpoint[]>({ endpoint })

    if (!response.value) return []

    const posts = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return posts
  }

  static async getAmountOfUser (params: { userId: number }): Promise<number> {
    const response = await VIBE.get<number>({
      endpoint: `posts/count?userId=${params.userId}`
    })

    if (response.success) {
      return response.value!
    } else {
      return -1
    }
  }

  static async getById (params: { postId: number }): Promise<Post | null> {
    const response = await VIBE.get<PostEndpoint>({
      endpoint: `posts/${params.postId}`
    })

    if (!response.success) return null

    const post = getAdaptedPost({ postEndpoint: response.value! })

    return post
  }

  static async search (params: {
    query: string
    userId?: number
    amount?: number
    page?: number
  }): Promise<Post[]> {
    const endpoint = params.userId
      ? `posts/search/${params.query}?userId=${params.userId}&amount=${
          params.amount ?? 6
        }&page=${params.page ?? 1}`
      : `posts/search/${params.query}?amount=${params.amount ?? 6}&page=${
          params.page ?? 1
        }`
    const response = await VIBE.get<PostEndpoint[]>({ endpoint })

    if (!response.success) return []

    const posts = response.value!.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return posts
  }
}
