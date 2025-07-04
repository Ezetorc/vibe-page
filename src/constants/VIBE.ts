import { API } from '../models/API'
import { SessionService } from '../services/SessionService'

const VIBE_API_URL = import.meta.env.VITE_API_URL ?? ''
const session = SessionService.get()
const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json'
}

if (session) {
  defaultHeaders['Authorization'] = `Bearer ${session}`
}

export const VIBE = new API({
  url: VIBE_API_URL,
  formatToJson: true,
  abortSeconds: 60
})
  .setDefaultHeaders(defaultHeaders)
  .setDefaultOptions({ credentials: 'include' })
