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

  private getParsedUrl (endpoint: string): string {
    const parsedEndpoint =
      endpoint.charAt(0) === '/' ? endpoint.slice(1) : endpoint
    const url = `${this.url}/${parsedEndpoint}`

    return url
  }

  public setDefaultHeaders (headers: HeadersInit) {
    this.headers = headers
    return this
  }

  public setDefaultOptions (options: RequestInit) {
    this.options = options
    return this
  }

  private async _getParsedResponse<T> (response: Response): Promise<Data<T>> {
    if (this.formatToJson) {
      const jsonData: Data<T> = await response.json()

      return jsonData
    } else {
      return response as unknown as Data<T>
    }
  }

  private async _fetch<T> (
    method: string,
    options: FetchOptions
  ): Promise<Data<T | null>> {
    const controller = new AbortController()
    const url = this.getParsedUrl(options.endpoint)
    const timeout = setTimeout(
      () => controller.abort(),
      this.abortSeconds * 1000
    )
    const fetchHeaders = {
      ...this.headers,
      ...options.headers
    }
    const fetchOptions = {
      ...this.options,
      ...options
    }

    try {
      const response = await fetch(url, {
        headers: fetchHeaders,
        method,
        signal: controller.signal,
        ...fetchOptions
      })

      clearTimeout(timeout)

      if (!response.ok) {
        return Data.failure(response.statusText)
      }

      const parsedResponse: Data<T> = await this._getParsedResponse(response)

      return parsedResponse
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
