import { Data } from 'api-responser'
import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { api } from '../constants/SETTINGS'
import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'

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

  static async getAll (): Promise<Data<Post[]>> {
    const response = await api.get<PostEndpoint[]>({ endpoint: 'posts' })

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
