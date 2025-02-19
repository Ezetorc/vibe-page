import { useState } from 'react'
import { Like } from '../models/Like'
import { User } from '../models/User'

export function usePost () {
  const [postData, setPostData] = useState<{
    user: User | null
    likes: Like[] | null
    comments: Comment[] | null
    date: string | null
  }>({
    user: null,
    likes: null,
    comments: null,
    date: null
  })

  return { postData, setPostData }
}
