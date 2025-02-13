import { Section } from '../../../components/Section'
import { SearchBar } from '../../../components/SearchBar'
import { PostsDisplay } from '../../../components/PostsDisplay'
import { Loading } from '../../../components/Loading'
import { Nav } from '../../../components/Nav'
import { FollowButton } from './FollowButton'
import { useAccount } from '../hooks/useAccount'
import { Post } from '../../../models/Post'
import { useSettings } from '../../../hooks/useSettings'
import { AccountName } from './AccountName'
import { AccountDescription } from './AccountDescription'
import { AccountDate } from './AccountDate'

export default function Account () {
  const { dictionary } = useSettings()
  const { account, posts, setPosts, handleSearch, accountIsUser } = useAccount()

  if (!account) return <Loading />

  const handlePostDelete = (postId: number) => {
    const newPosts: Post[] = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  return (
    <Section>
      <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(300px,auto,400px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <div className='gap-x-[20px] justify-center grid grid-cols-[1fr,2fr] grid-rows-[1fr,1fr]'>
          <img className='self-center mb-[10px] justify-self-end row-[span_2] rounded-full w-[clamp(70px,50%,90px)] aspect-square bg-orange-crayola' />

          <AccountName />
          <AccountDate />
        </div>

        <AccountDescription />
      </article>

      {!accountIsUser && <FollowButton account={account} />}

      <SearchBar
        onSearch={handleSearch}
        placeholder={dictionary.searchMyPosts}
      />

      <PostsDisplay onPostDelete={handlePostDelete} posts={posts} />

      <Nav />
    </Section>
  )
}
