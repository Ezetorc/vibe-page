import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { Data } from '../models/Data'
import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'
import { fetchAPI } from '../utilities/fetchAPI'

export class UserService {
  static async getByUsername ({
    username
  }: {
    username: string
  }): Promise<Data<User>> {
    const response = await fetchAPI<UserEndpoint>({
      url: `/users/username/${username}`
    })

    if (!response.value) return Data.failure()

    const user: User = getAdaptedUser({ userEndpoint: response.value })

    return Data.success(user)
  }

  static async getById ({ userId }: { userId: number }): Promise<Data<User>> {
    const response = await fetchAPI<UserEndpoint>({
      url: `/users/id/${userId}`
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
    const response = await fetchAPI<boolean>({
      url: `/users/register`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include'
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
    const response = await fetchAPI<boolean>({
      url: `/users/login`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
      credentials: 'include'
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async logout (): Promise<Data<boolean>> {
    const response = await fetchAPI<boolean>({
      url: `/logout`,
      method: 'POST',
      credentials: 'include'
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async getAll (): Promise<Data<User[]>> {
    const response = await fetchAPI<UserEndpoint[]>({
      url: `/users`,
      credentials: 'include'
    })

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
    const response = await fetchAPI({
      url: `/users/emailExists/${encodeURIComponent(email)}`,
      credentials: 'include'
    })

    if (!response.value) return Data.failure()

    return Data.success(true)
  }

  static async search ({ query }: { query: string }): Promise<Data<User[]>> {
    const response = await fetchAPI<UserEndpoint[]>({
      url: `/users/search/${encodeURIComponent(query)}`,
      credentials: 'include'
    })

    if (!response.value) return Data.failure()

    const users: User[] = response.value.map(userEndpoint =>
      getAdaptedUser({ userEndpoint })
    )

    return Data.success(users)
  }
}
