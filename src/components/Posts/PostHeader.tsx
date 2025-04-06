import { useSettings } from '../../hooks/useSettings'
import { useUser } from '../../hooks/useUser'
import { PostData } from '../../models/PostData'
import { getDateMessage } from '../../utilities/getDateMessage'
import { UserImage } from '../UserImage'
import { Username } from '../Username'
import { PostMenu } from './PostMenu'

export function PostHeader (props: {
  postData: PostData
  onDelete: (postId: number) => void
}) {
  const { user } = useUser()
  const { dictionary } = useSettings()
  const isLoading = !props.postData.user && !props.postData.date

  const handleDelete = async () => {
    if (!props.postData.id) return

    props.onDelete(props.postData.id)
  }

  return (
    <header
      className='w-full mobile:h-[140px] desktop:h-[70px] place-items-center 
    grid mobile:grid-cols-[1fr] desktop:grid-cols-[2fr_10fr_4fr_1fr] 
    mobile:grid-rows-[auto_auto_auto] desktop:grid-rows-1 gap-x-[5px]'
    >
      {isLoading ? (
        <div className='w-full h-full animate-shimmer bg-shimmer'></div>
      ) : (
        <>
          <UserImage
            className='w-[clamp(40px,100%,60px)]'
            user={props.postData.user}
          />

          <div className='w-full'>
            <Username
              id={props.postData.user?.id}
              className='mobile:text-[clamp(15px,1.5rem,25px)] desktop:text-[clamp(20px,1.8rem,21px)] desktop:col-auto desktop:row-auto mobile:col-span-2 mobile:row-[2]'
            >
              {props.postData.user?.name}
            </Username>
          </div>

          <span className='content-center text-right w-full mobile:col-span-2 mobile:row-[3] desktop:col-auto desktop:row-auto text-caribbean-current h-full font-poppins-light text-[clamp(5px,6vw,20px)]'>
            {dictionary[getDateMessage(props.postData.date)]}
          </span>

          {props.postData.user?.id &&
            user?.isOwnerOfPost({ postUserId: props.postData.user.id }) && (
              <div className='mobile:col-[2] mobile:row-[1] desktop:col-auto desktop:row-auto flex desktop:justify-center mobile:justify-self-end items-center'>
                <PostMenu onDelete={handleDelete} />
              </div>
            )}
        </>
      )}
    </header>
  )
}
