import { ModalData } from './ModalData'
import { ModalName } from './ModalName'

export class Modal {
  name?: ModalName
  data?: ModalData

  constructor (props: { name?: ModalName; data?: ModalData } = {}) {
    this.name = props.name
    this.data = props.data
  }

  public get hasData (): boolean {
    return typeof this.data === 'object'
  }

  public get hasName (): boolean {
    return typeof this.data === 'string'
  }

  public has (property: string): boolean {
    if (!this.hasData) return false

    return property in this.data!
  }
}
