export class Session {
  static get () {
    return localStorage.getItem('session')
  }

  static set (newValue: string) {
    localStorage.setItem('session', newValue)
  }

  static remove () {
    localStorage.removeItem('session')
  }
}
