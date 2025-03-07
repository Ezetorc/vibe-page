import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'
import { api } from '../constants/SETTINGS'

export class UserService {
  static async getByName (args: { name: string }): Promise<User | null> {
    const response = await api.get<UserEndpoint>({
      endpoint: `users/name?name=${args.name}`
    })

    if (!response.success) return null

    const user: User = getAdaptedUser({ userEndpoint: response.value! })

    return user
  }

  static async delete (args: { userId: number }): Promise<number> {
    const response = await api.delete<boolean>({
      endpoint: `users?id=${args.userId}`
    })

    if (response.success) {
      return args.userId
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
    const response = await api.post<boolean>({ endpoint: `logout` })

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

  static async emailExists (args: { email: string }): Promise<boolean> {
    const response = await api.get<UserEndpoint>({
      endpoint: `users/email?email=${encodeURIComponent(args.email)}`
    })

    return response.success
  }

  static async nameExists (args: { name: string }): Promise<boolean> {
    const response = await api.get<boolean>({
      endpoint: `users/name?name=${args.name}`
    })

    return response.success
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
