import { useUser } from '../../hooks/useUser'
import { PostData } from '../../models/PostData'
import { Username } from '../Username'
import { PostMenu } from './PostMenu'

export function PostHeader (props: {
  postData: PostData
  onDelete: (postId: number) => void
}) {
  const { user } = useUser()

  const handleDelete = async () => {
    if (!props.postData.id) return

    props.onDelete(props.postData.id)
  }

  if (!props.postData.user?.id) return

  return (
    <header
      className='w-full mobile:h-[140px] desktop:h-[70px] place-items-center 
    grid mobile:grid-cols-[1fr] desktop:grid-cols-[2fr_7fr_4fr_1fr] 
    mobile:grid-rows-[auto_auto_auto] desktop:grid-rows-1'
    >
      {props.postData.id}
      <img
        title={`${props.postData.user.name} Profile Picture`}
        className='mobile:col-[1] mobile:row-[1] desktop:col-auto justify-self-center mobile:ml-[25%] desktop:row-auto rounded-full desktop:w-[clamp(40px,5vw,60px)] mobile:w-[clamp(40px,20vw,60px)] aspect-square border-orange-crayola border-vibe'
        src={props.postData.user.imageUrl ?? 'src/assets/images/guest_user.jpg'}
        alt='Profile'
      />

      <Username className='mobile:text-center desktop:text-left desktop:pl-[10px] mobile:text-[clamp(18px,1rem,30px)] desktop:text-[clamp(20px,1.8rem,21px)] desktop:col-auto desktop:row-auto mobile:col-span-2 mobile:row-[2]'>
        {props.postData.user.name}
      </Username>

      <span className='mobile:col-span-2 mobile:row-[3] desktop:col-auto desktop:row-auto text-caribbean-current h-full flex justify-center items-center text-center font-poppins-light text-[clamp(5px,6vw,20px)]'>
        {props.postData.date}
      </span>

      {user?.isOwnerOfPost({ postUserId: props.postData.user.id }) && (
        <div className='mobile:col-[2] mobile:row-[1] desktop:col-auto desktop:row-auto flex desktop:justify-center mobile:justify-self-end items-center'>
          <PostMenu onDelete={handleDelete} />
        </div>
      )}
    </header>
  )
}
