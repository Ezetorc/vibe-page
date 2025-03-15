import { Cache } from '../models/Cache'

export class CacheService {
  private static getItem (url: string): Cache | null {
    const item = sessionStorage.getItem(url)
    return item ? (JSON.parse(item) as Cache) : null
  }

  static exists (url: string): boolean {
    return this.getItem(url) !== null
  }

  static remove (url: string): void {
    sessionStorage.removeItem(url)
  }

  static isValid (url: string, maxAgeMs: number = 5 * 60 * 1000): boolean {
    const item = this.getItem(url)
    return item ? Date.now() - item.timestamp < maxAgeMs : false
  }

  static get (url: string): Cache | null {
    return this.isValid(url) ? this.getItem(url) : null
  }

  static add (url: string, data: unknown): void {
    const cacheItem = { data, timestamp: Date.now() }
    sessionStorage.setItem(url, JSON.stringify(cacheItem))
  }
}
