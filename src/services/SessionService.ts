import { VIBE } from '../constants/VIBE'

export class SessionService {
  private static _key: string = 'vibe_session'

  static get () {
    return localStorage.getItem(this._key)
  }

  static set (newSession: string) {
    localStorage.setItem(this._key, newSession)

    VIBE.setDefaultHeaders({
      ...VIBE.headers,
      Authorization: `Bearer ${newSession}`
    })
  }

  static remove () {
    localStorage.removeItem(this._key)
  }
}
