import { blankResume, uid } from './types'
import type { Resume, Experience, Education } from './types'

const HEAD = /^(professional\s+)?(summary|profile|objective|about( me)?|experience|work experience|professional experience|employment( history)?|education|academics?|academic background|skills|technical skills|core skills|key skills|projects?|certifications?|achievements|awards)\s*:?$/i
const CAPS = /^[A-Z][A-Z &/]{3,28}$/
const BUL = /^\s*[•\-*▪◦·►]\s*/
const DATES = /((?:[A-Z][a-z]{2,8}\.?\s+)?(?:19|20)\d{2})\s*(?:-|–|—|to)\s*((?:[A-Z][a-z]{2,8}\.?\s+)?(?:(?:19|20)\d{2}|Present|Current|Now))/i
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/
const PHONE = /\+?\d[\d\s().-]{8,}\d/
const LINK = /(https?:\/\/\S+|(?:www\.|linkedin\.com|github\.com)\S*)/i

const kind = (h: string) => {
  const s = h.toLowerCase()
  if (/summary|profile|objective|about/.test(s)) return 'summary'
  if (/experience|employment/.test(s)) return 'experience'
  if (/education|academ/.test(s)) return 'education'
  if (/skill/.test(s)) return 'skills'
  return 'other'
}

function splitDates(line: string) {
  const m = line.match(DATES)
  return m
    ? { start: m[1], end: m[2], rest: line.replace(m[0], '').replace(/[()|,–—-]\s*$/, '').trim() }
    : { start: '', end: '', rest: line.trim() }
}

/** Best-effort parse of pasted resume text. The user reviews the result in the editor. */
export function parseResume(text: string): Resume {
  const t = text.trim()
  if (t.startsWith('{')) {
    try { return { ...blankResume(), ...JSON.parse(t) } as Resume } catch { /* fall through to text */ }
  }
  const r = blankResume()
  const lines = t.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const buckets: { name: string; heading: string; lines: string[] }[] = [{ name: 'top', heading: '', lines: [] }]
  for (const l of lines) {
    if (HEAD.test(l) || CAPS.test(l)) buckets.push({ name: kind(l), heading: l.replace(/:$/, ''), lines: [] })
    else buckets[buckets.length - 1].lines.push(l)
  }

  const top = buckets[0].lines
  if (top[0]) r.basics.name = top[0]
  const extras: string[] = []
  for (const l of top.slice(1)) {
    for (const p of l.split(/\s*[|•·]\s*/)) {
      if (EMAIL.test(p)) r.basics.email = p.match(EMAIL)![0]
      else if (LINK.test(p)) r.basics.link = p.match(LINK)![0]
      else if (PHONE.test(p)) r.basics.phone = p.match(PHONE)![0]
      else if (p.length < 70) extras.push(p)
      else extras.push(p)
    }
  }
  if (extras[0] && extras[0].length < 60) r.basics.title = extras[0]
  if (extras[1] && extras[1].length < 60) r.basics.location = extras[1]

  for (const b of buckets.slice(1)) {
    if (b.name === 'summary') r.basics.summary += (r.basics.summary ? ' ' : '') + b.lines.join(' ')
    else if (b.name === 'experience') r.experience.push(...parseExperience(b.lines))
    else if (b.name === 'education') r.education.push(...parseEducation(b.lines))
    else if (b.name === 'skills') r.skills.push(...parseSkills(b.lines))
    else r.experience.push({ id: uid(), role: b.heading, company: '', start: '', end: '', bullets: b.lines.map(l => l.replace(BUL, '')).join('\n') })
  }
  if (buckets.length === 1) r.basics.summary = top.slice(1).join(' ')
  return r
}

function parseExperience(lines: string[]): Experience[] {
  const out: Experience[] = []
  let cur: Experience | null = null
  for (const l of lines) {
    if (BUL.test(l)) {
      const b = l.replace(BUL, '')
      if (!cur) { cur = { id: uid(), role: '', company: '', start: '', end: '', bullets: '' }; out.push(cur) }
      cur.bullets += (cur.bullets ? '\n' : '') + b
      continue
    }
    const d = splitDates(l)
    const hasDates = !!d.start
    if (cur && !hasDates && cur.bullets && /^[a-z]/.test(l)) { cur.bullets += ' ' + l; continue }
    if (cur && !hasDates && !cur.bullets && !cur.company) { cur.company = l; continue }
    if (cur && hasDates && !cur.start && !cur.bullets) { cur.start = d.start; cur.end = d.end; if (d.rest && !cur.company) cur.company = d.rest; continue }
    const parts = d.rest.split(/\s+(?:at|@)\s+|\s*[|,–—]\s*/).filter(Boolean)
    cur = { id: uid(), role: parts[0] ?? '', company: parts.slice(1).join(', '), start: d.start, end: d.end, bullets: '' }
    out.push(cur)
  }
  return out
}

function parseEducation(lines: string[]): Education[] {
  return lines.map(l => {
    const d = splitDates(l.replace(BUL, ''))
    const parts = d.rest.split(/\s*[|,–—]\s*/).filter(Boolean)
    return { id: uid(), school: parts[0] ?? '', degree: parts.slice(1).join(', '), start: d.start, end: d.end }
  })
}

function parseSkills(lines: string[]) {
  const groups = []
  const loose: string[] = []
  for (const raw of lines) {
    const l = raw.replace(BUL, '')
    const i = l.indexOf(':')
    if (i > 0 && i < 40) groups.push({ id: uid(), label: l.slice(0, i).trim(), items: l.slice(i + 1).trim() })
    else loose.push(l)
  }
  if (loose.length) groups.push({ id: uid(), label: 'Skills', items: loose.join(', ') })
  return groups
}
