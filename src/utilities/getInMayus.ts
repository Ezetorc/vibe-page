export function getInMayus (string: string): string {
  if (typeof string !== 'string') return ''

  return string.charAt(0).toUpperCase() + string.slice(1)
}
