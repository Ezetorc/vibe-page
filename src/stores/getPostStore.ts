import { create } from 'zustand'
import { PostStore } from '../models/PostStore'

export const getPostStore = create<PostStore>(set => ({
  postData: {
    user: null,
    likes: null,
    comments: null,
    date: null,
    hasUserLiked: null,
    post: null
  },
  setPostData: newPostData => set({ postData: newPostData }),

  isLoading: true,
  setIsLoading: newIsLoading => set({ isLoading: newIsLoading })
}))
