export function getDateMessage (date: string | null): string {
  if (!date) return ''

  const [day, month, year] = date.split('/').map(Number)
  const fullYear = year < 100 ? 2000 + year : year
  const inputDate = new Date(fullYear, month - 1, day)
  const today = new Date()

  inputDate.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)

  const timeDiff = inputDate.getTime() - today.getTime()
  const dayDiff = timeDiff / (1000 * 60 * 60 * 24)

  if (dayDiff === 0) return 'today'
  if (dayDiff === -1) return 'yesterday'

  return inputDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
