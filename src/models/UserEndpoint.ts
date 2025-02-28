export interface UserEndpoint {
  id: number
  name: string
  email: string
  password: string
  image_id: string | null
  image_url: string | null
  description: string
  created_at: string
}
