export function getInMinus (string: string): string {
  if (typeof string !== 'string') return ''

  return string.charAt(0).toLowerCase() + string.slice(1)
}
