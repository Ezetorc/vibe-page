import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { LikeType } from '../models/LikeType'

export function getAdaptedLike ({
  likeEndpoint
}: {
  likeEndpoint: LikeEndpoint
}): Like {
  return new Like({
    id: likeEndpoint.id,
    type: likeEndpoint.type as LikeType,
    targetId: likeEndpoint.target_id,
    userId: likeEndpoint.user_id
  })
}
