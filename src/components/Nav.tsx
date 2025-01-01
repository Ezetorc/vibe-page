import { HomeIcon, PlusIcon, SearchIcon, SettingsIcon, UserIcon } from './Icons'

export function Nav () {
  return (
    <nav className='flex justify-center items-center w-[200px] h-[50px] bg-[#fff]'>
      <HomeIcon filled={false} />
      <SearchIcon filled={false} />
      <UserIcon filled={false} />
      <PlusIcon filled={false} />
      <SettingsIcon filled={false} />
    </nav>
  )
}
