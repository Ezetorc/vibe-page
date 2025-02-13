import { api, apiAbortSeconds } from '../constants/settings'
import { Data } from '../models/Data'

export async function fetchAPI<T> (
  options: RequestInit & { url: string }
): Promise<Data<T>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), apiAbortSeconds * 1000)

  try {
    const response = await fetch(`${api}${options.url}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      ...options
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return Data.failure(response.status)
    }

    const data: T = await response.json()
    return Data.success(data)
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn('Request aborted due to timeout')
    }

    return Data.failure(error)
  }
}
