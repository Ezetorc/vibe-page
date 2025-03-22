import { useState } from 'react'
import { PostDisplayProps } from '../../models/Props/PostDisplayProps'
import { PostHeader } from './PostHeader'
import { PostContent } from './PostContent'
import { PostFooter } from './PostFooter'
import { PostComments } from './PostComments'
import { usePostData } from '../../hooks/usePostData'

export function PostDisplay (props: PostDisplayProps) {
  const [commentsOpened, setCommentsOpened] = useState<boolean>(false)
  const {
    postData,
    likePost,
    dislikePost,
    createComment,
    deleteComment,
    isLoading
  } = usePostData(props.post)

  return (
    <>
      <article className='w-[clamp(300px,100%,700px)] py-[10px] px-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <PostHeader postData={postData} onDelete={props.onDelete} />
        <PostContent postData={postData} />
        <PostFooter
          postData={postData}
          setCommentsOpened={setCommentsOpened}
          commentsOpened={commentsOpened}
          likePost={likePost}
          dislikePost={dislikePost}
          isLoading={isLoading}
        />
      </article>

      {commentsOpened && postData.comments && (
        <PostComments
          postData={postData}
          createComment={createComment}
          deleteComment={deleteComment}
        />
      )}
    </>
  )
}
