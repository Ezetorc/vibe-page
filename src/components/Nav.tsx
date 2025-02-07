import { HomeIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from './Icons'
import { NavButton } from './NavButton'

export function Nav () {
  return (
    <nav className='flex z-30 justify-center gap-x-[4%] fixed bottom-0 left-0 items-center w-full h-[70px] bg-caribbean-current'>
      <NavButton to='/' icon={<HomeIcon />} />
      <NavButton to='/search' icon={<SearchIcon />} />
      <NavButton to='/create' icon={<PlusIcon />} needsSession={true} />
      <NavButton to='/account/me' icon={<UserIcon />} needsSession={true} />
      <NavButton to='/settings' icon={<SettingsIcon />} />
    </nav>
  )
}
