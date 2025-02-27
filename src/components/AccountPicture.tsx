import { AccountPictureProps } from '../models/Props/AccountPictureProps'

export function AccountPicture (props: AccountPictureProps) {
  return (
    <img
      title={`${props.username} Profile Picture`}
      className='mobile:col-[1] mobile:row-[1] desktop:col-auto desktop:justify-self-center mobile:justify-self-end desktop:row-auto rounded-full desktop:w-[clamp(40px,3vw,80px)] mobile:w-[clamp(40px,20vw,60px)] aspect-square bg-orange-crayola'
    />
  )
}
