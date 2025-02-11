import { Follower } from '../models/Follower'
import { FollowerEndpoint } from '../models/FollowerEndpoint'

export function getAdaptedFollower (
  followerEndpoint: FollowerEndpoint
): Follower {
  return new Follower({
    followerId: followerEndpoint.follower_id,
    followingId: followerEndpoint.following_id
  })
}
