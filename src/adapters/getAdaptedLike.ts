import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'

export function getAdaptedLike (likeEndpoint: LikeEndpoint): Like {
  return new Like({
    id: likeEndpoint.id,
    postId: likeEndpoint.post_id,
    userId: likeEndpoint.user_id
  })
}
