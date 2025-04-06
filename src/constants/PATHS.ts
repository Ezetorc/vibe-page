import { Language } from '../models/Language'

export const PATHS = {
  guestImage: '/images/guest_user.webp',
  dictionaryFile: '/text/dictionary.csv',
  termsFile: (language: Language) => `/text/terms[${language}].md`,
  homeSection: '/',
  registerSection: '/register',
  loginSection: '/login',
  searchSection: '/search',
  createSection: '/create',
  accountIdSection: '/account/:userId',
  accountSection: '/account',
  settingsSection: '/settings',
  termsSection: '/terms',
  homeElement: './pages/Home/components/Home.tsx',
  loginElement: './pages/Login/components/Login.tsx',
  searchElement: './pages/Search/components/Search.tsx',
  createElement: './pages/Create/components/Create.tsx',
  accountElement: './pages/Account/components/Account.tsx',
  termsElement: './pages/Terms/components/Terms.tsx',
  settingsElement: './pages/Settings/components/Settings.tsx',
  registerElement: './pages/Register/components/Register.tsx'
}
