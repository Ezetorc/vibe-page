import { HomeIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from './Icons'
import { NavButton } from '../pages/Home/components/NavButton'

export function Nav () {
  return (
    <nav className='flex z-30 justify-center gap-x-[4%] fixed bottom-0 left-0 items-center w-full h-[70px] bg-caribbean-current'>
      <NavButton to='/' icon={<HomeIcon />} />
      <NavButton to='/search' icon={<SearchIcon />} />
      <NavButton to='/create' icon={<PlusIcon />} needsSession={true} />
      <NavButton to='/account' icon={<UserIcon />} />
      <NavButton to='/settings' icon={<SettingsIcon />} />
    </nav>
  )
}
