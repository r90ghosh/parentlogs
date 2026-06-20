/**
 * Derive a single skimmable one-liner from a paragraph.
 * Used by the v2 Digest to show "one-liner first, detail on demand" when the
 * DB has no authored `digest` headline yet (§2.1 v1 fallback).
 */
export function firstSentence(text: string | null | undefined): string {
  if (!text) return ''
  const trimmed = text.replace(/\s+/g, ' ').trim()
  if (!trimmed) return ''
  // First clause ending in . ! ? followed by whitespace or end-of-string.
  const match = trimmed.match(/^.*?[.!?](?=\s|$)/)
  const sentence = (match ? match[0] : trimmed).trim()
  // If the first "sentence" is suspiciously short (e.g. an abbreviation like
  // "Dr."), fall back to the full text so we never show a fragment.
  return sentence.length < 12 && sentence.length < trimmed.length ? trimmed : sentence
}
