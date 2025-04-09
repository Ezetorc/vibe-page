import { useState } from 'react'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { useUserPosts } from '../hooks/useUserPosts'
import { User } from '../../../models/User'

export function AccountPosts (props: { user: User }) {
  const { dictionary } = useSettings()
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const { deletePost, posts, hasMore, ref } = useUserPosts(props.user, searchQuery)

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
