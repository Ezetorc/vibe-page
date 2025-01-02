import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'

export function getAdaptedUser (userEndpoint: UserEndpoint): User {
  return new User({
    id: userEndpoint.id,
    name: userEndpoint.name,
    email: userEndpoint.email,
    password: userEndpoint.password,
    profileImageId: userEndpoint.profile_image_id,
    description: userEndpoint.description,
    createdAt: userEndpoint.created_at
  })
}
