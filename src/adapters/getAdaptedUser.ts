import { User } from '../models/User'
import { UserEndpoint } from '../models/UserEndpoint'
import { FollowService } from '../services/FollowService'
import { PostService } from '../services/PostService'
import { getDate } from '../utilities/getDate'

export async function getAdaptedUser (params: {
  userEndpoint: UserEndpoint
}): Promise<User> {
  const userId = params.userEndpoint.id
  const date = getDate(params.userEndpoint.created_at)
  const postsAmount = await PostService.getAmountOfUser({ userId })
  const followersAmount = await FollowService.getFollowersAmount({ userId })
  const followingAmount = await FollowService.getFollowingAmount({ userId })

  return new User({
    id: params.userEndpoint.id,
    name: params.userEndpoint.name,
    email: params.userEndpoint.email,
    password: params.userEndpoint.password,
    imageId: params.userEndpoint.image_id,
    imageUrl: params.userEndpoint.image_url,
    description: params.userEndpoint.description,
    date,
    postsAmount,
    followersAmount,
    followingAmount
  })
}
