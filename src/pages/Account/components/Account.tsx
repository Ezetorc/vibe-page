import { Section } from '../../../components/Section'
import { SearchBar } from '../../../components/SearchBar'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { Nav } from '../../../components/Nav'
import { useAccount } from '../hooks/useAccount'
import { useSettings } from '../../../hooks/useSettings'
import { AccountName } from './AccountName'
import { AccountDescription } from './AccountDescription'
import { AccountDate } from './AccountDate'
import { AccountInteractions } from './AccountInteractions'
import { useState } from 'react'
import { useUserPosts } from '../hooks/useUserPosts'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { AccountPicture } from './AccountPicture'

export default function Account () {
  const { dictionary } = useSettings()
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)
  const account = useAccount()
  const posts = useUserPosts(account.user, searchQuery)

  if (!account.user)
    return (
      <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
        {dictionary.userNotFound}
      </h3>
    )

  const handlePostDelete = (postId: number) => {
    posts.delete(postId)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <Section>
      <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(400px,auto,600px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <div className='flex flex-col justify-center items-center gap-x-[20px] gap-y-[10px] mb-[25px]'>
          <AccountPicture />
          <AccountName />
          <AccountDate />
        </div>

        <AccountDescription />
        <AccountInteractions />
      </article>

      <SearchBar
        onSearch={handleSearch}
        placeholder={dictionary.searchMyPosts}
      />

      <PostsDisplay onPostDelete={handlePostDelete} posts={posts.data} />
      {posts?.hasNextPage && <LoadSpinner reference={posts.ref} />}

      <Nav />
    </Section>
  )
}
