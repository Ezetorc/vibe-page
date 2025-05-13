export function cutWord (text?: string, maxLength?: number): string | undefined {
  const MAX_LENGTH = maxLength ?? 10

  if (!text) return text

  if (text.length <= MAX_LENGTH) {
    return text
  }
  
  return text.slice(0, MAX_LENGTH - 3) + '...'
}
