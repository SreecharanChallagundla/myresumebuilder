import type { Resume } from './types'

const STOP = new Set(`a about above across after all also an and any are as at be been being both but by can could do does each etc for from get had has have having he her his how i if in including into is it its job just like may more most must new no not of on one only or other our out over own per role s such than that the their them then there these they this those through to too under up use used using via was we well were what when where which while who will with within without would you your
experience experienced work working works team teams ability able strong skills skill knowledge years year plus preferred required requirements responsibilities responsible candidate looking join company position opportunity environment business support ensure develop developing development build building help including related relevant understanding excellent good great proven demonstrated understand across highly based need needs include includes day time well etc`.split(/\s+/))

const norm = (w: string) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w)

export function tokens(text: string): string[] {
  return (text.toLowerCase().match(/[a-z][a-z0-9+#.]*[a-z0-9+#]|[a-z]/g) ?? [])
    .map(w => w.replace(/\.+$/, ''))
    .filter(w => w.length >= 2 && !STOP.has(w))
}

export function resumeText(r: Resume): string {
  const b = r.basics
  return [
    b.title, b.summary,
    ...r.experience.flatMap(x => [x.role, x.company, x.bullets]),
    ...r.education.flatMap(x => [x.school, x.degree]),
    ...r.skills.flatMap(x => [x.label, x.items]),
  ].join(' \n ')
}

export interface MatchResult { score: number; matched: string[]; missing: string[] }

export function analyze(r: Resume, jd: string, max = 30): MatchResult {
  const freq = new Map<string, number>()
  for (const w of tokens(jd)) freq.set(norm(w), (freq.get(norm(w)) ?? 0) + 1)
  const keywords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([w]) => w)
  const have = new Set(tokens(resumeText(r)).map(norm))
  const matched = keywords.filter(k => have.has(k))
  const missing = keywords.filter(k => !have.has(k))
  return { score: keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0, matched, missing }
}
