import { getAdaptedPost } from '../adapters/getAdaptedPost'
import { Post } from '../models/Post'
import { PostEndpoint } from '../models/PostEndpoint'
import { Data } from '../models/Data'
import { fetchAPI } from '../utilities/fetchAPI'

export class PostService {
  static async create ({
    userId,
    content
  }: {
    userId: number
    content: string
  }): Promise<Data<boolean>> {
    return fetchAPI<boolean>({
      url: '/posts',
      method: 'POST',
      body: JSON.stringify({ user_id: userId, content })
    })
  }

  static async getAll (): Promise<Data<Post[]>> {
    const response = await fetchAPI<PostEndpoint[]>({
      url: '/posts'
    })

    if (!response.value) return Data.failure()

    const posts: Post[] = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return Data.success(posts)
  }

  static async getById ({ postId }: { postId: number }): Promise<Data<Post>> {
    const response = await fetchAPI<PostEndpoint>({
      url: `/posts/id/${postId}`
    })

    if (!response.value) return Data.failure()

    const post: Post = getAdaptedPost({ postEndpoint: response.value })

    return Data.success(post)
  }

  static async search ({ query }: { query: string }): Promise<Data<Post[]>> {
    const response = await fetchAPI<PostEndpoint[]>({
      url: `/posts/search/${encodeURIComponent(query)}`
    })

    if (!response.value) return Data.failure()

    const posts: Post[] = response.value.map(postEndpoint =>
      getAdaptedPost({ postEndpoint })
    )

    return Data.success(posts)
  }
}
