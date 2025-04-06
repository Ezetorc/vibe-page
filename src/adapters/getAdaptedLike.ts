import { Like } from '../models/Like'
import { LikeEndpoint } from '../models/LikeEndpoint'
import { LikeType } from '../models/LikeType'

export function getAdaptedLike (params: { likeEndpoint: LikeEndpoint }): Like {
  return new Like({
    id: params.likeEndpoint.id,
    type: params.likeEndpoint.type as LikeType,
    targetId: params.likeEndpoint.target_id,
    userId: params.likeEndpoint.user_id
  })
}
