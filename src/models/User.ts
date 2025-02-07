import { format } from '@formkit/tempo'
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

  static async getByUsername (username: string): Promise<User> {
    const url: string = `${api}/users/username/${username}`
    const response: Response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
    const userEndpoint: UserEndpoint = await response.json()
    const user: User = getAdaptedUser(userEndpoint)

    return user
  }

  static async getById (userId: number): Promise<User> {
    const url: string = `${api}/users/id/${userId}`
    const response: Response = await fetch(url, {
      method: 'GET',
      credentials: 'include'
    })
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
  ): Promise<boolean> {
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
        return false
      }

      return true
    } catch {
      return false
    }
  }

  public getDate (): string {
    const parsedDate: Date = new Date(this.createdAt.replace(' ', 'T'))
    const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

    return formattedDate
  }

  static async login (name: string, password: string): Promise<boolean> {
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
        return false
      }

      return true
    } catch {
      return false
    }
  }

  static async logout (): Promise<boolean> {
    const response: Response = await fetch(`${api}/logout`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      return false
    }

    return true
  }

  public async changeName (newName: string): Promise<boolean> {
    const url: string = `${api}/users/id/${this.id}`
    const body = {
      name: newName
    }

    const response: Response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    this.name = newName
    return true
  }

  public async changeDescription (newDescription: string): Promise<boolean> {
    const url: string = `${api}/users/id/${this.id}`
    const body = {
      description: newDescription
    }

    const response: Response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    this.description = newDescription
    return true
  }

  static async getAll (): Promise<User[]> {
    const url: string = `${api}/users`
    const response: Response = await fetch(url)
    const usersEndpoints: UserEndpoint[] = await response.json()
    const users: User[] = usersEndpoints.map(userEndpoint =>
      getAdaptedUser(userEndpoint)
    )

    return users
  }

  static async emailAlreadyExists (email: string): Promise<boolean> {
    const users: User[] = await this.getAll()
    const emailAlreadyExists: boolean = users.some(user => user.email === email)

    return emailAlreadyExists
  }

  public async getPosts (): Promise<Post[]> {
    const posts: Post[] = await Post.getAll()
    const userPosts: Post[] = posts.filter(post => post.userId === this.id)

    return userPosts
  }

  public async changeEmail (newEmail: string): Promise<boolean> {
    const url: string = `${api}/users/id/${this.id}`
    const body = {
      email: newEmail
    }

    const response: Response = await fetch(url, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    this.email = newEmail
    return true
  }

  public async likePost (postId: number): Promise<boolean> {
    const url: string = `${api}/likes`
    const body = {
      post_id: postId,
      user_id: this.id
    }

    const response: Response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      return false
    }

    return true
  }

  public async unlikePost (postId: number): Promise<boolean> {
    try {
      const post = await Post.getById(postId)
      const postLikes: Like[] = await post.getLikes()
      const likeToDelete: Like | undefined = postLikes.find(
        like => like.userId === this.id
      )

      if (!likeToDelete) {
        return false
      }

      const url: string = `${api}/likes/id/${likeToDelete.id}`

      const response: Response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch {
      return false
    }
  }

  static async search (query: string): Promise<User[]> {
    const url: string = `${api}/users/search/${encodeURIComponent(query)}`
    const response = await fetch(url)
    const usersEndpoints: UserEndpoint[] = await response.json()
    const users: User[] = usersEndpoints.map(userEndpoint =>
      getAdaptedUser(userEndpoint)
    )

    return users
  }
}
