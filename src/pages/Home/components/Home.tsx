import { PostsDisplay } from '../../../components/PostsDisplay'
import { LoadSpinner } from '../../../components/LoadSpinner'
import { useSettings } from '../../../hooks/useSettings'
import { usePosts } from '../../../hooks/usePosts'
import { FirstPosterMessage } from './FirstPosterMessage'
import { Nav } from '../../../components/Nav'

export default function Home () {
  const { dictionary } = useSettings()
  const { failed, posts, ref, deletePost, hasMore, isEmpty, success } =
    usePosts()

  if (failed)
    return (
      <p className='font-poppins-light text-caribbean-current'>
        {dictionary.error}
      </p>
    )

  return (
    <>
      <Nav />
      <main className='pb-nav w-[clamp(320px,100%,700px)] gap-y-[20px] p-[clamp(5px,3%,10px)] items-center flex flex-col min-h-screen'>
        {success ? (
          isEmpty ? (
            <FirstPosterMessage />
          ) : (
            <PostsDisplay posts={posts} onPostDelete={deletePost} />
          )
        ) : (
          <LoadSpinner />
        )}

        {hasMore && <div className='w-full h-[20px]' ref={ref}></div>}
      </main>
    </>
  )
}
