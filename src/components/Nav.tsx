import { PATHS } from '../constants/PATHS'
import { useSettings } from '../hooks/useSettings'
import { HomeIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from './Icons'
import { NavButton } from './NavButton'

export function Nav () {
  const { dictionary } = useSettings()

  return (
    <nav className='flex z-30 justify-center gap-x-[4%] fixed bottom-0 left-0 items-center w-full h-[70px] bg-caribbean-current'>
      <NavButton
        title={dictionary.home}
        to={PATHS.homeSection}
        icon={<HomeIcon />}
      />
      <NavButton
        title={dictionary.search}
        to={PATHS.searchSection}
        icon={<SearchIcon />}
      />
      <NavButton
        title={dictionary.create}
        to={PATHS.createSection}
        icon={<PlusIcon />}
        needsSession
      />
      <NavButton
        title={dictionary.account}
        to={PATHS.accountSection}
        icon={<UserIcon />}
        needsSession
      />
      <NavButton
        title={dictionary.settings}
        to={PATHS.settingsSection}
        icon={<SettingsIcon />}
      />
    </nav>
  )
}
