import { ChangeEvent } from 'react'

export class RegisterData {
  public name: string
  public email: string
  public password: string
  public confirmedPassword: string
  public agreeWithTerms: boolean

  constructor (props: {
    name: string
    email: string
    password: string
    confirmedPassword: string
    agreeWithTerms: boolean
  }) {
    this.name = props.name
    this.email = props.email
    this.password = props.password
    this.confirmedPassword = props.confirmedPassword
    this.agreeWithTerms = props.agreeWithTerms
  }

  public update (event: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target

    return new RegisterData({
      name: this.name,
      email: this.email,
      password: this.password,
      confirmedPassword: this.confirmedPassword,
      agreeWithTerms: this.agreeWithTerms,
      [name]: type === 'checkbox' ? checked : value
    })
  }
}
