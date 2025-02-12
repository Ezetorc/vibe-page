import { getAdaptedUser } from '../adapters/getAdaptedUser'
import { api } from '../constants/SETTINGS'
import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'

export class UserService {
  static async getByUsername ({
    username
  }: {
    username: string
  }): Promise<User | null> {
    try {
      const url: string = `${api}/users/username/${username}`
      const response: Response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return null
      }

      const userEndpoint: UserEndpoint = await response.json()
      const user: User = getAdaptedUser({ userEndpoint })

      return user
    } catch (error) {
      console.error('Error fetching user by username:', error)
      return null
    }
  }

  static async getById ({ userId }: { userId: number }): Promise<User | null> {
    try {
      const url: string = `${api}/users/id/${userId}`
      const response: Response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return null
      }

      const userEndpoint: UserEndpoint = await response.json()
      const user: User = getAdaptedUser({ userEndpoint })

      return user
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      return null
    }
  }

  static async register ({
    name,
    email,
    password
  }: {
    name: string
    email: string
    password: string
  }): Promise<boolean> {
    try {
      const url: string = `${api}/users/register`
      const body = { name, email, password }
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
    } catch (error) {
      console.error('Error during registration:', error)
      return false
    }
  }

  static async login ({
    name,
    password
  }: {
    name: string
    password: string
  }): Promise<boolean> {
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
    } catch (error) {
      console.error('Error during login:', error)
      return false
    }
  }

  static async logout (): Promise<boolean> {
    try {
      const response: Response = await fetch(`${api}/logout`, {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch (error) {
      console.error('Error during logout:', error)
      return false
    }
  }

  static async getAll (): Promise<User[]> {
    try {
      const url: string = `${api}/users`
      const response: Response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return []
      }

      const usersEndpoints: UserEndpoint[] = await response.json()
      const users: User[] = usersEndpoints.map(userEndpoint =>
        getAdaptedUser({ userEndpoint })
      )

      return users
    } catch (error) {
      console.error('Error fetching all users:', error)
      return []
    }
  }

  static async emailAlreadyExists ({
    email
  }: {
    email: string
  }): Promise<boolean> {
    try {
      const url = `${api}/users/emailExists/${encodeURIComponent(email)}`
      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return false
      }

      return true
    } catch (error) {
      console.error('Error checking if email exists:', error)
      return false
    }
  }

  static async search ({ query }: { query: string }): Promise<User[]> {
    try {
      const url: string = `${api}/users/search/${encodeURIComponent(query)}`
      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        return []
      }

      const usersEndpoints: UserEndpoint[] = await response.json()
      const users: User[] = usersEndpoints.map(userEndpoint =>
        getAdaptedUser({ userEndpoint })
      )

      return users
    } catch (error) {
      console.error('Error searching for users:', error)
      return []
    }
  }
}
