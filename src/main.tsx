import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Root } from './components/Root'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getMinutes } from './utilities/getMinutes'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: getMinutes(5),
      gcTime: getMinutes(10),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Root />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
