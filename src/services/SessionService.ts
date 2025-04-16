export class SessionService {
  private static _key: string = 'vibe_session'

  static get () {
    return localStorage.getItem(this._key)
  }

  static set (newSession: string) {
    localStorage.setItem(this._key, newSession)
  }

  static remove () {
    localStorage.removeItem(this._key)
  }
}
