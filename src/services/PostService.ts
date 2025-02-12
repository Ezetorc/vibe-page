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
  }): Promise<boolean> {
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
    } catch (error) {
      console.error('Error creating post:', error)
      return false
    }
  }

  static async getAll (): Promise<Post[]> {
    try {
      const url: string = `${api}/posts`
      const response: Response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return []
      }

      const postsEndpoints: PostEndpoint[] = await response.json()
      const posts: Post[] = postsEndpoints.map((postEndpoint: PostEndpoint) =>
        getAdaptedPost({ postEndpoint })
      )

      return posts
    } catch (error) {
      console.error('Error fetching all posts:', error)
      return []
    }
  }

  static async getById ({ postId }: { postId: number }): Promise<Post | null> {
    try {
      const url: string = `${api}/posts/id/${postId}`
      const response: Response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        return null
      }

      const postEndpoint: PostEndpoint = await response.json()
      const post: Post = getAdaptedPost({ postEndpoint })

      return post
    } catch (error) {
      console.error('Error fetching post by ID:', error)
      return null
    }
  }

  static async search ({ query }: { query: string }): Promise<Post[]> {
    try {
      const url: string = `${api}/posts/search/${encodeURIComponent(query)}`
      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return []
      }

      const postsEndpoints: PostEndpoint[] = await response.json()
      const posts: Post[] = postsEndpoints.map(postEndpoint =>
        getAdaptedPost({ postEndpoint })
      )

      return posts
    } catch (error) {
      console.error('Error searching for posts:', error)
      return []
    }
  }
}
