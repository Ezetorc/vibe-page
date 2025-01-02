import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { api } from '../constants/api'
import { Like } from './Like'
import { Post } from './Post'
import { UserEndpoint } from './UserEndpoint'

export class User {
  public id: number
  public name: string
  public email: string
  public password: string
  public profileImageId: string | null
  public description: string
  public createdAt: string

  constructor ({
    id,
    name,
    email,
    password,
    profileImageId,
    description,
    createdAt
  }: {
    id: number
    name: string
    email: string
    password: string
    profileImageId: string | null
    description: string
    createdAt: string
  }) {
    this.id = id
    this.name = name
    this.email = email
    this.password = password
    this.profileImageId = profileImageId
    this.description = description
    this.createdAt = createdAt
  }

  static async getById (userId: number): Promise<User> {
    const url: string = `${api}/users/${userId}`
    const response: Response = await fetch(url)
    const userEndpoint: UserEndpoint = await response.json()
    const user: User = getAdaptedUser(userEndpoint)

    return user
  }

  public async hasLikedPost (postId: number): Promise<boolean> {
    const post: Post = await Post.getById(postId)
    const postLikes: Like[] = await post.getLikes()
    const userLike: Like | undefined = postLikes.find(
      like => like.userId === this.id
    )

    return Boolean(userLike)
  }

  static async register (
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    const url: string = `${api}/users/register`
    const body = { name, email, password }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        throw new Error(errorData.message || 'Error registering user')
      }
    } catch (error) {
      console.error('Error during registration:', error)
      throw error
    }
  }

  static async login (name: string, password: string): Promise<void> {
    try {
      const url: string = `${api}/users/login`
      const body = { name, password }

      const response: Response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      console.log('User logged in successfully')
    } catch (error) {
      console.error('Error during login:', error)
    }
  }

  static async logout () {
    fetch(`${api}/logout`, {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      console.log('Logout successful')
    })
  }

  public async likePost (postId: number): Promise<void> {
    const url: string = `${api}/likes`
    const body = {
      post_id: postId,
      user_id: this.id
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  public async unlikePost (postId: number): Promise<void> {
    try {
      const post = await Post.getById(postId)
      const postLikes: Like[] = await post.getLikes()
      const likeToDelete: Like | undefined = postLikes.find(
        like => like.userId === this.id
      )

      if (!likeToDelete) {
        throw new Error('Like not found')
      }

      const url: string = `${api}/likes/${likeToDelete.id}`

      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error unliking post:', error)
    }
  }
}
