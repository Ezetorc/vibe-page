import { useState } from 'react'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { SearchBar } from '../../../components/SearchBar'
import { useSettings } from '../../../hooks/useSettings'
import { User } from '../../../models/User'
import { usePosts } from '../../../hooks/usePosts'

export function AccountPosts (props: { user: User }) {
  const { dictionary } = useSettings()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const { deletePost, posts, hasMore, ref, failed, isEmpty } = usePosts(
    searchQuery,
    props.user
  )

  if (failed) {
    return (
      <p className='font-poppins-light text-caribbean-current'>
        {dictionary.error}
      </p>
    )
  } else {
    return (
      <>
        <SearchBar
          onSearch={query => setSearchQuery(query)}
          placeholder={dictionary.searchMyPosts}
        />

        {isEmpty ? (
          <span className='text-caribbean-current '>{dictionary.noPosts}</span>
        ) : (
          <PostsDisplay onPostDelete={deletePost} posts={posts} />
        )}

        {hasMore && <LoadSpinner reference={ref} />}
      </>
    )
  }
}
