export function getAccessToken () {
  console.log('document.cookie: ', document.cookie)
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('access_token='))
    ?.split('=')[1]
}
