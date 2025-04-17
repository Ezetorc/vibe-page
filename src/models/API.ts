import { Data } from './Data'

interface FetchOptions extends RequestInit {
  endpoint: string
  formatToJson?: boolean
}

interface FetchWithJSONOptions extends FetchOptions {
  formatToJson?: true
}

interface FetchWithoutJSONOptions extends FetchOptions {
  formatToJson?: false
}

export class API {
  public url: string
  public abortSeconds: number
  public formatToJson: boolean
  public headers: HeadersInit = {}
  public options: RequestInit = {}

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
    return `${this.url}/${parsedEndpoint}`
  }

  public setDefaultHeaders (headers: HeadersInit) {
    this.headers = headers
    return this
  }

  public setDefaultOptions (options: RequestInit) {
    this.options = options
    return this
  }

  private async _getParsedResponse(
    response: Response,
    formatToJson: false
  ): Promise<Response>

  private async _getParsedResponse<T>(
    response: Response,
    formatToJson: true
  ): Promise<Data<T>>

  private async _getParsedResponse<T> (
    response: Response,
    formatToJson: boolean
  ): Promise<Data<T> | Response> {
    return formatToJson ? response.json() : response
  }

  private async _fetch<T>(
    method: string,
    options: FetchWithJSONOptions
  ): Promise<Data<T>>

  private async _fetch(
    method: string,
    options: FetchWithoutJSONOptions
  ): Promise<Response>

  private async _fetch<T> (
    method: string,
    options: FetchOptions
  ): Promise<Data<T | null> | Response> {
    const controller = new AbortController()
    const url = this.getParsedUrl(options.endpoint)
    const timeout = setTimeout(
      () => controller.abort(),
      this.abortSeconds * 1000
    )
    const fetchHeaders = { ...this.headers, ...options.headers }
    const fetchOptions = { ...this.options, ...options }

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

      const formatToJson = options.formatToJson ?? this.formatToJson

      if (formatToJson) {
        return this._getParsedResponse<T>(response, formatToJson)
      } else {
        return this._getParsedResponse(response, formatToJson)
      }
    } catch (error) {
      return Data.failure(String(error))
    }
  }

  public get<T>(options: FetchWithJSONOptions): Promise<Data<T>>
  public get(options: FetchWithoutJSONOptions): Promise<Response>
  public get<T> (options: FetchOptions): Promise<Data<T | null> | Response> {
    if (options.formatToJson) {
      return this._fetch<T>('GET', options as FetchWithJSONOptions)
    } else {
      return this._fetch('GET', options as FetchWithoutJSONOptions)
    }
  }

  public post<T>(options: FetchWithJSONOptions): Promise<Data<T>>
  public post(options: FetchWithoutJSONOptions): Promise<Response>
  public post<T> (options: FetchOptions): Promise<Data<T | null> | Response> {
    if (options.formatToJson) {
      return this._fetch<T>('POST', options as FetchWithJSONOptions)
    } else {
      return this._fetch('POST', options as FetchWithoutJSONOptions)
    }
  }

  public put<T>(options: FetchWithJSONOptions): Promise<Data<T>>
  public put(options: FetchWithoutJSONOptions): Promise<Response>
  public put<T> (options: FetchOptions): Promise<Data<T | null> | Response> {
    if (options.formatToJson) {
      return this._fetch<T>('PUT', options as FetchWithJSONOptions)
    } else {
      return this._fetch('PUT', options as FetchWithoutJSONOptions)
    }
  }

  public patch<T>(options: FetchWithJSONOptions): Promise<Data<T>>
  public patch(options: FetchWithoutJSONOptions): Promise<Response>
  public patch<T> (options: FetchOptions): Promise<Data<T | null> | Response> {
    if (options.formatToJson) {
      return this._fetch<T>('PATCH', options as FetchWithJSONOptions)
    } else {
      return this._fetch('PATCH', options as FetchWithoutJSONOptions)
    }
  }

  public delete<T>(options: FetchWithJSONOptions): Promise<Data<T>>
  public delete(options: FetchWithoutJSONOptions): Promise<Response>
  public delete<T> (options: FetchOptions): Promise<Data<T | null> | Response> {
    if (options.formatToJson) {
      return this._fetch<T>('DELETE', options as FetchWithJSONOptions)
    } else {
      return this._fetch('DELETE', options as FetchWithoutJSONOptions)
    }
  }
}
