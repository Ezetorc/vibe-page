import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { QUERY_CLIENT } from './constants/QUERY_CLIENT'
import { Root } from './Root'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={QUERY_CLIENT}>
      <Root />
    </QueryClientProvider>
  </StrictMode>
)
