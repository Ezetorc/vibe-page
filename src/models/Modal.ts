import { ModalName } from './ModalName'

export interface Modal {
  name: ModalName | null
  data?: object | undefined
}
