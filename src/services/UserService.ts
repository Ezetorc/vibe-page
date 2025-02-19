import { Data } from 'api-responser'
import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'
import { api } from '../constants/settings'

export class UserService {
  static async getByUsername ({
    username
  }: {
    username: string
  }): Promise<Data<User>> {
    const response = await api.get<UserEndpoint>({
      endpoint: `users/username/${username}`
    })

    if (!response.value) return Data.failure()

    const user: User = getAdaptedUser({ userEndpoint: response.value })

    return Data.success(user)
  }

  static async getById ({ userId }: { userId: number }): Promise<Data<User>> {
    const response = await api.get<UserEndpoint>({
      endpoint: `users/id/${userId}`
    })

    if (!response.value) return Data.failure()

    const user: User = getAdaptedUser({ userEndpoint: response.value })

    return Data.success(user)
  }

  static async register ({
    name,
    email,
    password
  }: {
    name: string
    email: string
    password: string
  }): Promise<Data<boolean>> {
    const response = await api.post<boolean>({
      endpoint: `users/register`,
      body: JSON.stringify({ name, email, password })
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async login ({
    name,
    password
  }: {
    name: string
    password: string
  }): Promise<Data<boolean>> {
    const response = await api.post<boolean>({
      endpoint: `users/login`,
      body: JSON.stringify({ name, password })
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async logout (): Promise<Data<boolean>> {
    const response = await api.post<boolean>({ endpoint: `logout` })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async getAll (): Promise<Data<User[]>> {
    const response = await api.get<UserEndpoint[]>({ endpoint: `users` })

    if (!response.value) return Data.failure()

    const users: User[] = response.value.map(userEndpoint =>
      getAdaptedUser({ userEndpoint })
    )

    return Data.success(users)
  }

  static async emailAlreadyExists ({
    email
  }: {
    email: string
  }): Promise<Data<boolean>> {
    const response = await api.get({
      endpoint: `users/emailExists/${encodeURIComponent(email)}`
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async nameAlreadyExists ({
    name
  }: {
    name: string
  }): Promise<Data<boolean>> {
    const response = await api.get<boolean>({
      endpoint: `users/nameExists/${name}`
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async search ({ query }: { query: string }): Promise<Data<User[]>> {
    const response = await api.get<UserEndpoint[]>({
      endpoint: `users/search/${encodeURIComponent(query)}`
    })

    if (!response.value) return Data.failure()

    const users: User[] = response.value.map(userEndpoint =>
      getAdaptedUser({ userEndpoint })
    )

    return Data.success(users)
  }
}
