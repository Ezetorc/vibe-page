import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'

export function getAdaptedUser (params: { userEndpoint: UserEndpoint }): User {
  return new User({
    id: params.userEndpoint.id,
    name: params.userEndpoint.name,
    email: params.userEndpoint.email,
    password: params.userEndpoint.password,
    imageId: params.userEndpoint.image_id,
    imageUrl: params.userEndpoint.image_url,
    description: params.userEndpoint.description,
    createdAt: params.userEndpoint.created_at
  })
}
