type DataError = string | null | undefined
type DataValue<T> = T

export class Data<T> {
  public value: DataValue<T>
  public error: DataError

  constructor (error: DataError, value: DataValue<T>) {
    this.value = value
    this.error = error
  }

  static failure (error: DataError): Data<null> {
    return new Data(error, null)
  }

  static success<T> (value: DataValue<T>): Data<T> {
    return new Data(null, value)
  }
}
