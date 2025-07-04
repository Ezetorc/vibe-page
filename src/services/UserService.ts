import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'
import { VIBE } from '../constants/VIBE'
import { SessionService } from './SessionService'
import { Post } from '../models/Post'
import { Comment } from '../models/Comment'
import { getDate } from '../utilities/getDate'
import { CLOUDINARY } from '../constants/CLOUDINARY'
import { SimplifiedUserEndpoint } from '../models/SimplifiedUserEndpoint'

export class UserService {
  static getFromEndpoint (params: {
    userEndpoint: UserEndpoint | SimplifiedUserEndpoint
  }): User {
    const date =
      'created_at' in params.userEndpoint
        ? getDate(params.userEndpoint.created_at)
        : undefined
    const { imageId, imageUrl } = CLOUDINARY.getImageData(
      params.userEndpoint.image
    )

    return new User({
      id: params.userEndpoint.id,
      name: params.userEndpoint.name,
      imageId,
      imageUrl,
      description:
        'description' in params.userEndpoint
          ? params.userEndpoint.description
          : undefined,
      date
    })
  }

  static async delete (params: {
    userId: number
    imageId: string | null | undefined
  }): Promise<number> {
    const response = await VIBE.delete<boolean>({
      endpoint: `users`
    })

    if (!response.error) {
      if (!params.imageId) return params.userId

      const deleteSuccess = await this.deleteImage({
        publicId: params.imageId
      })

      if (deleteSuccess) {
        return params.userId
      } else {
        return -1
      }
    } else {
      return -1
    }
  }

  static async getById (params: { userId: number }): Promise<User | null> {
    const response = await VIBE.get<UserEndpoint>({
      endpoint: `users/${params.userId}`
    })

    if (response.error) return null

    const user: User = this.getFromEndpoint({
      userEndpoint: response.value!
    })

    return user
  }

  static async register (params: {
    name: string
    email: string
    password: string
  }): Promise<boolean> {
    const response = await VIBE.post({
      endpoint: `users/register`,
      formatToJson: false,
      body: JSON.stringify({
        name: params.name,
        email: params.email,
        password: params.password
      })
    })

    if (response.ok) {
      const authorizationHeader = response.headers.get('Authorization')

      if (authorizationHeader) {
        SessionService.set(authorizationHeader.split(' ')[1])
      }

      return true
    } else {
      return false
    }
  }

  static async login (params: {
    name: string
    password: string
  }): Promise<boolean> {
    const response = await VIBE.post({
      endpoint: `users/login`,
      body: JSON.stringify({ name: params.name, password: params.password }),
      formatToJson: false
    })

    if (response.ok) {
      const authorizationHeader = response.headers.get('Authorization')

      if (authorizationHeader) {
        SessionService.set(authorizationHeader.split(' ')[1])
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  static async getAll (
    params: {
      amount?: number
      page?: number
    } = {}
  ): Promise<User[]> {
    const response = await VIBE.get<UserEndpoint[]>({
      endpoint: `users?amount=${params.amount ?? 6}&page=${params.page ?? 1}`
    })

    if (response.error) return []

    const users: User[] = response.value.map(userEndpoint =>
      this.getFromEndpoint({ userEndpoint })
    )

    return users
  }

  static async emailExists (params: { email: string }): Promise<boolean | null> {
    const response = await VIBE.get<boolean>({
      endpoint: `users/exists?email=${params.email}`
    })

    return response.value
  }

  static async nameExists (params: { name: string }): Promise<boolean | null> {
    const response = await VIBE.get<boolean>({
      endpoint: `users/exists?name=${params.name}`
    })

    return response.value
  }

  static async search (params: {
    query: string
    amount?: number
    page?: number
  }): Promise<User[]> {
    const response = await VIBE.get<UserEndpoint[]>({
      endpoint: `users/search/${params.query}?amount=${
        params.amount ?? 6
      }&page=${params.page ?? 1}`
    })

    if (response.error) return []

    const users: User[] = response.value.map(userEndpoint =>
      this.getFromEndpoint({ userEndpoint })
    )

    return users
  }

  static async hasLikedPost (params: {
    userId: User['id']
    postId: Post['id']
  }): Promise<boolean> {
    const response = await VIBE.get<boolean>({
      endpoint: `users/${params.userId}/liked?type=post&targetId=${params.postId}`
    })

    return Boolean(response.value)
  }

  static async hasLikedComment (params: {
    userId: User['id']
    commentId: Comment['id']
  }): Promise<boolean> {
    const response = await VIBE.get<boolean>({
      endpoint: `users/${params.userId}/liked?type=comment&targetId=${params.commentId}`
    })

    return Boolean(response.value)
  }

  static async update (params: {
    body: object
    onSuccess?: (updatedUser: User) => void
  }): Promise<boolean> {
    const response = await VIBE.patch<UserEndpoint>({
      endpoint: `users`,
      body: JSON.stringify(params.body)
    })

    if (response.error) return false

    const updatedUser = this.getFromEndpoint({
      userEndpoint: response.value
    })

    if (params.onSuccess) params.onSuccess(updatedUser)
    return true
  }

  static async deleteImage (params: { publicId: string }): Promise<boolean> {
    const response = await VIBE.delete<boolean>({
      endpoint: `users/image/${params.publicId}`
    })

    return !response.error
  }
}
