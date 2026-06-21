/** Shared helpers for the V2 digest screens. */

/** Derive a one-liner from a paragraph: the first sentence (or the whole string). */
export function firstSentence(text?: string | null): string {
  if (!text) return ''
  const trimmed = text.trim()
  const match = trimmed.match(/^.*?[.!?](\s|$)/)
  return (match ? match[0] : trimmed).trim()
}
