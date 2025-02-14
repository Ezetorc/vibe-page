import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'

export function getAdaptedLike ({
  likeEndpoint
}: {
  likeEndpoint: LikeEndpoint
}): Like {
  return new Like({
    id: likeEndpoint.id,
    type: likeEndpoint.type as 'post' | 'comment',
    targetId: likeEndpoint.target_id,
    userId: likeEndpoint.user_id
  })
}
