import { API } from '../models/API'
import { SessionService } from '../services/SessionService'

const VIBE_API_URL = import.meta.env.VITE_API_URL ?? ''
const session = SessionService.get()
const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
}

if (session) {
  console.log('session: ', session)
  defaultHeaders['Authorization'] = `Bearer ${session}`
}

console.log(defaultHeaders)

export const VIBE = new API({ url: VIBE_API_URL, formatToJson: true })
  .setDefaultHeaders(defaultHeaders)
  .setDefaultOptions({ credentials: 'include' })
