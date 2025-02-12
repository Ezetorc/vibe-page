import { Data } from '../models/Data'
import { api } from '../constants/SETTINGS'

export async function fetchAPI<T> (
  options: RequestInit & { url: string }
): Promise<Data<T>> {
  try {
    const response = await fetch(`${api}${options.url}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      ...options
    })

    if (!response.ok) {
      return Data.failure(`Error: ${response.status}`)
    }

    const data: T = await response.json()
    return Data.success(data)
  } catch (error) {
    return Data.failure(error)
  }
}
