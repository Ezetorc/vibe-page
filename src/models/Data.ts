export class Data<T> {
  private _data: T | null
  private _error: unknown

  constructor ({ data, error }: { data: T | null; error: unknown }) {
    this._data = data
    this._error = error
  }

  get value (): T | null {
    return this._data
  }

  set value (newValue: T | null) {
    this._data = newValue
  }

  get success (): boolean {
    return this._data !== null
  }

  get error (): unknown {
    return this._error
  }

  public async toJSON<T> (): Promise<T | null> {
    if (this._data instanceof Response) {
      return await this._data.json()
    }
    return null
  }

  static success<T> (data: T): Data<T> {
    return new Data<T>({ data, error: null })
  }

  static failure<T> (error?: unknown): Data<T> {
    return new Data<T>({ data: null, error })
  }
}
