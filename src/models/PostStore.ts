import { Comment } from './Comment'
import { Like } from './Like'
import { User } from './User'

interface PostData {
  user: null | User
  content: null | string
  likes: null | Like[]
  date: null | string
  id: null | number
  comments: null | Comment[]
  userLiked: null | boolean
}

export interface PostStore {
  postData: PostData
  setPostData: (newPostData: PostData) => void

  isLoading: boolean
  setIsLoading: (newIsLoading: boolean) => void

  commentsOpened: boolean
  setCommentsOpened: (newCommentsOpened: boolean) => void
}
