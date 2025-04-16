import { ChangeEvent } from 'react'

export class LoginData {
  public name: string
  public password: string

  constructor (props: { name: string; password: string }) {
    this.name = props.name
    this.password = props.password
  }

  public update (event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target

    return new LoginData({
      name: this.name,
      password: this.password,
      [name]: value
    })
  }
}
