import { Section } from '../../../components/Section'
import { Nav } from '../../../components/Nav'
import { useSettings } from '../../../hooks/useSettings'
import { AccountName } from './AccountName'
import { AccountDescription } from './AccountDescription'
import { AccountDate } from './AccountDate'
import { AccountInteractions } from './AccountInteractions'
import { AccountPicture } from './AccountPicture'
import { useParams } from 'react-router'
import { AccountPosts } from './AccountPosts'
import { AccountInfo } from './AccountInfo'
import { useEditState } from '../hooks/useEditState'
import { useUserData } from '../../../hooks/useUserData'

export default function Account () {
  const { username } = useParams<{ username: string }>()
  const { dictionary } = useSettings()
  const { userData, isLoading, isError } = useUserData(username)
  const edit = useEditState(userData)

  if (!userData.id) {
    if (isLoading && !isError) {
      return (
        <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
          {dictionary.loading}
        </h3>
      )
    } else {
      return (
        <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
          {dictionary.userNotFound}
        </h3>
      )
    }
  } else {
    return (
      <Section>
        <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(400px,auto,600px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
          <div className='flex flex-col justify-center items-center gap-x-[20px] gap-y-[10px] mb-[25px]'>
            <AccountPicture userData={userData} />
            <AccountName userData={userData} edit={edit} />
            <AccountDate userData={userData} />
            <AccountInfo userData={userData} />
          </div>

          <AccountDescription userData={userData} edit={edit} />
          <AccountInteractions userData={userData} />
        </article>

        <AccountPosts userData={userData} />

        <Nav />
      </Section>
    )
  }
}
