import { useState } from 'react'
import { PostHeader } from './PostHeader'
import { PostContent } from './PostContent'
import { PostFooter } from './PostFooter'
import { PostComments } from './PostComments'
import { Post } from '../models/Post'

export function PostDisplay (props: {
  post: Post
  onDelete: (post: Post) => void
}) {
  const [commentsOpened, setCommentsOpened] = useState<boolean>(false)

  return (
    <>
      <article className='w-[clamp(300px,100%,700px)] py-[10px] pr-[5px] pl-[10px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <PostHeader post={props.post} onDelete={props.onDelete} />
        <PostContent post={props.post} />
        <PostFooter
          post={props.post}
          setCommentsOpened={setCommentsOpened}
          commentsOpened={commentsOpened}
        />
      </article>

      {commentsOpened && <PostComments post={props.post} />}
    </>
  )
}
