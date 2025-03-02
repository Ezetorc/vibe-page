import { Section } from '../../../components/Section'
import { Nav } from '../../../components/Nav'
import { useAccount } from '../hooks/useAccount'
import { useSettings } from '../../../hooks/useSettings'
import { AccountName } from './AccountName'
import { AccountDescription } from './AccountDescription'
import { AccountDate } from './AccountDate'
import { AccountInteractions } from './AccountInteractions'
import { AccountPicture } from './AccountPicture'

export default function Account () {
  const { dictionary } = useSettings()
  const account = useAccount()

  if (!account.user)
    return (
      <h3 className='text-[clamp(20px,3rem,60px)] w-screen h-screen flex justify-center items-center'>
        {dictionary.userNotFound}
      </h3>
    )

  

  return (
    <Section>
      <article className='flex flex-col justify-center w-[clamp(300px,100%,700px)] h-[clamp(400px,auto,600px)] p-[20px] rounded-vibe border-vibe border-caribbean-current overflow-hidden'>
        <div className='flex flex-col justify-center items-center gap-x-[20px] gap-y-[10px] mb-[25px]'>
          <AccountPicture />
          <AccountName />
          <AccountDate />
        </div>

        <AccountDescription />
        <AccountInteractions />
      </article>

      

      <Nav />
    </Section>
  )
}
