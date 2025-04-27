import { useLocation } from 'wouter'
import { PATHS } from '../constants/PATHS'
import { useSession } from '../hooks/useSession'
import { useSettings } from '../hooks/useSettings'
import {
  BellIcon,
  HomeIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon
} from './Icons'
import { NavButton } from './NavButton'
import { UserImage } from './UserImage'

export function Nav () {
  const { dictionary, openModal } = useSettings()
  const { loggedUser, isSessionActive } = useSession()
  const [location] = useLocation()

  return (
    <nav className='flex z-30 justify-center gap-x-[4%] fixed bottom-0 left-0 items-center w-full h-[70px] bg-caribbean-current'>
      <NavButton title={dictionary.home} to={PATHS.homeSection}>
        <HomeIcon filled={location === PATHS.homeSection} />
      </NavButton>

      <NavButton title={dictionary.search} to={PATHS.searchSection}>
        <SearchIcon filled={location === PATHS.searchSection} />
      </NavButton>

      {!isSessionActive && (
        <NavButton
          title={dictionary.account}
          onClick={() => openModal('session')}
        >
          <UserIcon />
        </NavButton>
      )}

      <NavButton title={dictionary.post} to={PATHS.createSection} needsSession>
        <PlusIcon filled={location === PATHS.createSection} />
      </NavButton>
      
      <NavButton
        title={dictionary.notifications}
        to={PATHS.notificationsSection}
        needsSession
      >
        <BellIcon filled={location === PATHS.notificationsSection} />
      </NavButton>

      <NavButton title={dictionary.settings} to={PATHS.settingsSection}>
        <SettingsIcon filled={location === PATHS.settingsSection} />
      </NavButton>

      <NavButton
        title={dictionary.account}
        to={PATHS.accountSection}
        needsSession
      >
        <UserImage
          className='border-verdigris w-[clamp(30px,90%,60px)]'
          user={loggedUser}
        />
      </NavButton>
    </nav>
  )
}
