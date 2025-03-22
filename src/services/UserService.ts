import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'
import { api, cloudinary } from '../constants/SETTINGS'

export class UserService {
  static async getByName (args: { name: string }): Promise<User | null> {
    const response = await api.get<UserEndpoint>({
      endpoint: `users/name?name=${args.name}`
    })

    if (!response.success) return null

    const user: User = getAdaptedUser({ userEndpoint: response.value! })

    return user
  }

  static async delete (args: {
    userId: number
    imageId: string | null | undefined
  }): Promise<number> {
    const response = await api.delete<boolean>({
      endpoint: `users?id=${args.userId}`
    })

    if (response.success) {
      if (!args.imageId) return args.userId

      const deleteSuccess = await cloudinary.deleteImage({
        publicId: args.imageId
      })

      if (deleteSuccess) {
        return args.userId
      } else {
        return -1
      }
    } else {
      return -1
    }
  }

  static async getById (args: { userId: number }): Promise<User | null> {
    const response = await api.get<UserEndpoint>({
      endpoint: `users/id?id=${args.userId}`
    })

    if (!response.success) return null

    const user: User = getAdaptedUser({ userEndpoint: response.value! })

    return user
  }

  static async register (args: {
    name: string
    email: string
    password: string
  }): Promise<boolean> {
    const response = await api.post<boolean>({
      endpoint: `users/register`,
      body: JSON.stringify({
        name: args.name,
        email: args.email,
        password: args.password
      })
    })

    return response.success
  }

  static async login (args: {
    name: string
    password: string
  }): Promise<boolean> {
    const response = await api.post<boolean>({
      endpoint: `users/login`,
      body: JSON.stringify({ name: args.name, password: args.password })
    })

    return response.success
  }

  static async logout (): Promise<boolean> {
    const response = await api.post<boolean>({ endpoint: `users/logout` })

    return response.success
  }

  static async getAll (
    args: {
      amount?: number
      page?: number
    } = {}
  ): Promise<User[]> {
    const response = await api.get<UserEndpoint[]>({
      endpoint: `users/all?amount=${args.amount ?? 6}&page=${args.page ?? 1}`
    })

    if (!response.success) return []

    const users: User[] = response.value!.map(userEndpoint =>
      getAdaptedUser({ userEndpoint })
    )

    return users
  }

  static async emailExists (args: { email: string }): Promise<boolean | null> {
    const response = await api.get<boolean>({
      endpoint: `users/exists?email=${args.email}`
    })

    return response.value
  }

  static async nameExists (args: { name: string }): Promise<boolean | null> {
    const response = await api.get<boolean>({
      endpoint: `users/exists?name=${args.name}`
    })

    return response.value
  }

  static async search (args: { query: string }): Promise<User[]> {
    const response = await api.get<UserEndpoint[]>({
      endpoint: `users/search?query=${encodeURIComponent(args.query)}`
    })

    if (!response.success) return []

    const users: User[] = response.value!.map(userEndpoint =>
      getAdaptedUser({ userEndpoint })
    )

    return users
  }
}
