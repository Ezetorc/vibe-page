import { Section } from '../../../components/Section'
import { useSettings } from '../../../hooks/useSettings'
import { AccountName } from './AccountName'
import { AccountDescription } from './AccountDescription'
import { AccountDate } from './AccountDate'
import { AccountFollow } from './AccountFollow'
import { AccountPicture } from './AccountPicture'
import { AccountPosts } from './AccountPosts'
import { AccountInteractions } from './AccountInteractions'
import { useUser } from '../hooks/useUser'
import { Loading } from '../../../components/Loading'

export default function Account (props: { userId?: string | number }) {
  const { dictionary } = useSettings()
  const { user, isLoading, isError } = useUser(props.userId)

  return (
    <>
      {isLoading ? (
        <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
          <Loading />
        </h3>
      ) : isError ? (
        <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
          {dictionary.userNotFound}
        </h3>
      ) : (
        user && (
          <Section>
            <article className='gap-y-[10px] flex flex-col items-center w-[clamp(300px,100%,700px)] h-[clamp(400px,auto,600px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
              <AccountPicture user={user} />
              <AccountName user={user} />
              <AccountDescription user={user} />
              <AccountDate user={user} />
              <AccountInteractions user={user} />
              <AccountFollow user={user} />
            </article>

            <AccountPosts user={user} />
          </Section>
        )
      )}
    </>
  )
}
