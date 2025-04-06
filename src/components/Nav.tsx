import { PATHS } from '../constants/PATHS'
import { HomeIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from './Icons'
import { NavButton } from './NavButton'

export function Nav () {
  return (
    <nav className='flex z-30 justify-center gap-x-[4%] fixed bottom-0 left-0 items-center w-full h-[70px] bg-caribbean-current'>
      <NavButton to={PATHS.homeSection} icon={<HomeIcon />} />
      <NavButton to={PATHS.searchSection} icon={<SearchIcon />} />
      <NavButton to={PATHS.createSection} icon={<PlusIcon />} needsSession />
      <NavButton to={PATHS.accountSection} icon={<UserIcon />} needsSession />
      <NavButton to={PATHS.settingsSection} icon={<SettingsIcon />} />
    </nav>
  )
}
