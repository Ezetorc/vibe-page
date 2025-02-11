import { getAdaptedUser } from "../adapters/getAdaptedUser"
import { api } from "../constants/SETTINGS"
import { User } from "../models/User"
import { UserEndpoint } from "../models/UserEndpoint"

export class UserService {
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
    try {
      const url = `${api}/users/emailExists/${encodeURIComponent(email)}`
      const response = await fetch(url)
      return response.ok
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
