import { HomeIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from './Icons'
import { NavButton } from '../pages/Home/components/NavButton'

export function Nav () {
  return (
    <nav className='flex justify-center gap-x-[4%] fixed bottom-0 left-0 items-center w-full h-[70px] bg-caribbean-current'>
      <NavButton to='/' icon={<HomeIcon />} />
      <NavButton to='/search' icon={<SearchIcon />} />
      <NavButton to='/post' icon={<PlusIcon />} />
      <NavButton to='/settings' icon={<SettingsIcon />} />
      <NavButton to='/account' icon={<UserIcon />} />
    </nav>
  )
}
