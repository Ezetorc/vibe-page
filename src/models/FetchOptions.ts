export interface FetchOptions {
  endpoint: string
  signal?: AbortSignal
  params?: Record<string, unknown>
  data?: unknown
  headers?: Record<string, string>
}
