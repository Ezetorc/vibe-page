export function getSessionCookie () {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('session='))
    ?.split('=')[1]
}
