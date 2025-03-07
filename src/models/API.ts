import { Data } from './Data'

interface FetchOptions extends RequestInit {
  endpoint: string
}

export class API {
  public url: string
  public abortSeconds: number
  public formatToJson: boolean
  private headers: HeadersInit = {}
  private options: RequestInit = {}

  constructor ({
    url,
    formatToJson,
    abortSeconds
  }: {
    url: string
    abortSeconds?: number
    formatToJson?: boolean
  }) {
    this.url = url
    this.formatToJson = formatToJson ?? false
    this.abortSeconds = abortSeconds ?? 20
  }

  private _getParsedEndpoint (endpoint: string): string {
    return endpoint.charAt(0) === '/' ? endpoint.slice(1) : endpoint
  }

  public setDefaultHeaders (headers: HeadersInit) {
    this.headers = headers
    return this
  }

  public setDefaultOptions (options: RequestInit) {
    this.options = options
    return this
  }

  private async _fetch<T> (
    method: string,
    options: FetchOptions
  ): Promise<Data<T | null>> {
    const controller = new AbortController()
    const parsedEndpoint = this._getParsedEndpoint(options.endpoint)
    const url = `${this.url}/${parsedEndpoint}`
    const timeout = setTimeout(
      () => controller.abort(),
      this.abortSeconds * 1000
    )

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...this.headers,

          ...options.headers
        },
        credentials: 'include',
        method,
        signal: controller.signal,
        ...this.options,
        ...options
      })

      clearTimeout(timeout)

      if (!response.ok) {
        return Data.failure(response.statusText)
      }

      if (this.formatToJson) {
        const jsonData: Data<T> = await response.json()
        return jsonData
      } else {
        return response as unknown as Data<T>
      }
    } catch (error) {
      return Data.failure(String(error))
    }
  }

  public get<T> (options: FetchOptions): Promise<Data<T | null>> {
    return this._fetch<T>('GET', options)
  }

  public post<T> (options: FetchOptions): Promise<Data<T | null>> {
    return this._fetch<T>('POST', options)
  }

  public put<T> (options: FetchOptions): Promise<Data<T | null>> {
    return this._fetch<T>('PUT', options)
  }

  public patch<T> (options: FetchOptions): Promise<Data<T | null>> {
    return this._fetch<T>('PATCH', options)
  }

  public delete<T> (options: FetchOptions): Promise<Data<T | null>> {
    return this._fetch<T>('DELETE', options)
  }
}
