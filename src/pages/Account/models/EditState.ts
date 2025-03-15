import { Dispatch, SetStateAction } from 'react'

export interface EditState {
  field: 'name' | 'description' | null
  value: string
  handle: () => Promise<void>
  set: Dispatch<
    SetStateAction<{
      value: string
      field: 'name' | 'description' | null
    }>
  >
}
