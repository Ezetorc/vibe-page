import { lazy, Suspense } from 'react'
import { MODALS } from '../constants/MODALS'
import { useSettings } from '../hooks/useSettings'

export function ModalRenderer () {
  const { modal } = useSettings()
  const LazyModal = modal.name && lazy(MODALS[modal.name])

  return (
    <>
      {LazyModal && (
        <Suspense fallback={null}>
          <LazyModal />
        </Suspense>
      )}
    </>
  )
}
