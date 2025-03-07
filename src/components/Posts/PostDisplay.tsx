import { useCallback, useEffect, useState } from 'react'
import { PostDisplayProps } from '../../models/Props/PostDisplayProps'
import { PostHeader } from './PostHeader'
import { PostContent } from './PostContent'
import { PostFooter } from './PostFooter'
import { PostData } from '../../models/PostData'
import { useUser } from '../../hooks/useUser'
import { PostComments } from './PostComments'
import { getPostData } from '../../utilities/getPostData'

export function PostDisplay (props: PostDisplayProps) {
  const { user } = useUser()
  const [commentsOpened, setCommentsOpened] = useState<boolean>(false)
  const [postData, setPostData] = useState<PostData>({
    user: null,
    likes: null,
    comments: null,
    date: null,
    userLiked: null,
    id: null,
    content: null
  })

  const fetchPostData = useCallback(async () => {
    const newPostData = await getPostData(props.post, user)

    setPostData(newPostData)
  }, [props.post, user])

  useEffect(() => {
    fetchPostData()
  }, [fetchPostData])

  return (
    <>
      <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <PostHeader postData={postData} onDelete={props.onDelete} />
        <PostContent postData={postData} />
        <PostFooter
          postData={postData}
          setCommentsOpened={setCommentsOpened}
          commentsOpened={commentsOpened}
          setPostData={setPostData}
        />
      </article>

      {commentsOpened && postData.comments && (
        <PostComments postData={postData} setPostData={setPostData} />
      )}
    </>
  )
}
