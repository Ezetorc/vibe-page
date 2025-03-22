import { useState } from 'react'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { UserData } from '../models/UserData'
import { useUserPosts } from '../hooks/useUserPosts'

export function AccountPosts (props: { userData: UserData }) {
  const { dictionary } = useSettings()
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const { deletePost, posts, hasMore, ref } = useUserPosts(props.userData, searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handlePostDelete = async (postId: number) => {
    deletePost(postId)
  }

  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        placeholder={dictionary.searchMyPosts}
      />

      <PostsDisplay onPostDelete={handlePostDelete} posts={posts} />
      {hasMore && <LoadSpinner reference={ref} />}
    </>
  )
}
