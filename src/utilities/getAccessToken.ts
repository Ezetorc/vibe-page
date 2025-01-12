export function getAccessToken () {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1]
}
