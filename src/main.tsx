import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './components/Root'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import { queryClient } from './constants/SETTINGS'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
    </QueryClientProvider>
  </StrictMode>
)
