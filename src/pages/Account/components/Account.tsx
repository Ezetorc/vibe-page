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
import { useUserData } from '../../../hooks/useUserData'

export default function Account () {
  const { userId } = useParams<{ userId: string | undefined }>()
  const { dictionary } = useSettings()
  const { userData, isLoading, isError } = useUserData(userId)

  return (
    <>
      {isLoading ? (
        <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
          {dictionary.loading}
        </h3>
      ) : isError ? (
        <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
          {dictionary.userNotFound}
        </h3>
      ) : (
        <Section>
          <article className='gap-y-[10px] flex flex-col items-center w-[clamp(300px,100%,700px)] h-[clamp(400px,auto,600px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
            <AccountPicture userData={userData} />
            <AccountName userData={userData} />
            <AccountDescription userData={userData} />
            <AccountDate userData={userData} />
            <AccountInfo userData={userData} />
            <AccountInteractions userData={userData} />
          </article>

          <AccountPosts userData={userData} />
        </Section>
      )}

      <Nav />
    </>
  )
}
