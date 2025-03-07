import { DataError } from './DataError'
import { DataSuccess } from './DataSuccess'
import { DataValue } from './DataValue'

export class Data<T> {
  public value: DataValue<T>
  public error: DataError
  public success: DataSuccess

  constructor (error: DataError, success: DataSuccess, value: DataValue<T>) {
    this.value = value
    this.error = error
    this.success = success
  }

  static failure (error: DataError): Data<null> {
    return new Data(error, false, null)
  }

  static success<T> (value: DataValue<T>): Data<T> {
    return new Data(null, true, value)
  }
}
