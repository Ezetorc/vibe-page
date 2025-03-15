import { useState } from 'react'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { useUserPosts } from '../hooks/useUserPosts'
import { AccountData } from '../models/AccountData'

export function AccountPosts (props: { accountData: AccountData }) {
  const { dictionary } = useSettings()
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const posts = useUserPosts(props.accountData.user, searchQuery)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handlePostDelete = async (postId: number) => {
    posts.delete(postId)
  }
  
  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        placeholder={dictionary.searchMyPosts}
      />

      <PostsDisplay onPostDelete={handlePostDelete} posts={posts.data} />
      {posts?.hasNextPage && <LoadSpinner reference={posts.ref} />}
    </>
  )
}
