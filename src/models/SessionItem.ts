export class SessionItem {
  public userId: string
  public exp: number

  constructor (props: { userId: string; exp: number }) {
    this.userId = props.userId
    this.exp = props.exp
  }

  public get isExpired (): boolean {
    return Date.now() >= this.exp * 1000
  }
}
