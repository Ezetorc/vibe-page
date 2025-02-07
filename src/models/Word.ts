export class Word extends String {
  constructor (value: string) {
    super(value)
  }

  get value () {
    return this.toString()
  }

  get inMayus () {
    return this.value.charAt(0).toUpperCase() + this.value.slice(1)
  }

  get inMinus () {
    return this.value.charAt(0).toLowerCase() + this.value.slice(1)
  }
}
