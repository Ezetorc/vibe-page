import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'

export function getAdaptedUser ({
  userEndpoint
}: {
  userEndpoint: UserEndpoint
}): User {
  return new User({
    id: userEndpoint.id,
    name: userEndpoint.name,
    email: userEndpoint.email,
    password: userEndpoint.password,
    imageId: userEndpoint.image_id,
    imageUrl: userEndpoint.image_url,
    description: userEndpoint.description,
    createdAt: userEndpoint.created_at
  })
}
