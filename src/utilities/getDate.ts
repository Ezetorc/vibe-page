import { format } from '@formkit/tempo'

export function getDate (createdAt: string): string {
  const parsedDate: Date = new Date(createdAt.replace(' ', 'T'))
  const formattedDate: string = format(parsedDate, 'DD/MM/YYYY')

  return formattedDate
}
