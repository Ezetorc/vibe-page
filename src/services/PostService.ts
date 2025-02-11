import { getAdaptedPost } from "../adapters/getAdaptedPost"
import { api } from "../constants/SETTINGS"
import { Post } from "../models/Post"
import { PostEndpoint } from "../models/PostEndpoint"

export class PostService {
 
  static async create (userId: number, content: string): Promise<boolean> {
    try {
      const url: string = `${api}/posts`
      const body = {
        user_id: userId,
        content: content
      }
      const response: Response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  

  static async getAll (): Promise<Post[]> {
    const url: string = `${api}/posts`
    const response: Response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    const postsEndpoints: PostEndpoint[] = await response.json()
    const posts: Post[] = postsEndpoints.map((postEndpoint: PostEndpoint) =>
      getAdaptedPost(postEndpoint)
    )

    return posts
  }

  static async getById (postId: number): Promise<Post> {
    const url: string = `${api}/posts/id/${postId}`
    const response: Response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    const postEndpoint: PostEndpoint = await response.json()
    const post: Post = getAdaptedPost(postEndpoint)

    return post
  }

  static async search (query: string): Promise<Post[]> {
    const url: string = `${api}/posts/search/${encodeURIComponent(query)}`
    const response = await fetch(url)
    const postsEndpoints: PostEndpoint[] = await response.json()
    const posts: Post[] = postsEndpoints.map(postEndpoint =>
      getAdaptedPost(postEndpoint)
    )

    return posts
  }
}
