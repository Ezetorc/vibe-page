import { Section } from '../../../components/Section'
import { SearchBar } from '../../../components/SearchBar'
import { PostsDisplay } from '../../../components/Posts/PostsDisplay'
import { Loading } from '../../../components/Loading'
import { Nav } from '../../../components/Nav'
import { useAccount } from '../hooks/useAccount'
import { useSettings } from '../../../hooks/useSettings'
import { AccountName } from './AccountName'
import { AccountDescription } from './AccountDescription'
import { AccountDate } from './AccountDate'
import { AccountInteractions } from './AccountInteractions'
// import { ShareIcon } from '../../../components/Icons'

export default function Account () {
  const { dictionary } = useSettings()
  const { account, posts, setPosts, handleSearch } = useAccount()

  if (!account) return <Loading />

  const handlePostDelete = (postId: number) => {
    const newPosts = posts.filter(post => post.id !== postId)

    setPosts(newPosts)
  }

  // const handleShare = async () => {
  //   await account?.share({
  //     title: dictionary.followMe,
  //     text: dictionary.findMeInVibe
  //   })
  // }

  return (
    <Section>
      <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(400px,auto,600px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <div className='flex flex-col justify-center items-center gap-x-[20px] gap-y-[10px] mb-[25px]'>
          <img className='rounded-full w-[clamp(70px,50%,90px)] aspect-square bg-orange-crayola' />
          <AccountName />
          <AccountDate />
          
        </div>

        {/* <div>
          <button className='cursor-pointer scale-130' onClick={handleShare}>
            <ShareIcon />
          </button>
        </div> */}

        <AccountDescription />
        <AccountInteractions />
      </article>

      <SearchBar
        onSearch={handleSearch}
        placeholder={dictionary.searchMyPosts}
      />

      <PostsDisplay onPostDelete={handlePostDelete} posts={posts} />

      <Nav />
    </Section>
  )
}
