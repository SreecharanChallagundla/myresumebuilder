import type { ReactNode } from 'react'
import type { Resume } from './types'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="font-bold text-[11.5pt] border-b border-[#1f4e79] text-[#1f4e79] pb-0.5 mb-2">{title}</h2>
      {children}
    </section>
  )
}

const dates = (s: string, e: string) => [s, e].filter(Boolean).join(' – ')

export default function Preview({ data }: { data: Resume }) {
  const { basics: b, experience, education, skills } = data
  const contact = [b.email, b.phone, b.location, b.link].filter(Boolean)
  return (
    <article className="page" id="resume-page">
      <header>
        <h1 className="text-[22pt] leading-tight font-bold">{b.name || 'Your name'}</h1>
        {b.title && <p className="text-[12pt] text-[#1f4e79]">{b.title}</p>}
        {contact.length > 0 && <p className="text-[9.5pt] mt-1">{contact.join('  |  ')}</p>}
      </header>

      {b.summary && <Section title="Summary"><p>{b.summary}</p></Section>}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map(x => (
            <div key={x.id} className="mb-3 break-inside-avoid">
              <div className="flex justify-between gap-4">
                <strong>{[x.role, x.company].filter(Boolean).join(', ')}</strong>
                <span className="whitespace-nowrap">{dates(x.start, x.end)}</span>
              </div>
              <ul className="list-disc ml-5">
                {x.bullets.split('\n').filter(l => l.trim()).map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map(x => (
            <div key={x.id} className="flex justify-between gap-4 mb-1 break-inside-avoid">
              <span><strong>{x.school}</strong>{x.degree && `, ${x.degree}`}</span>
              <span className="whitespace-nowrap">{dates(x.start, x.end)}</span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          {skills.map(x => (
            <p key={x.id}><strong>{x.label}:</strong> {x.items}</p>
          ))}
        </Section>
      )}
    </article>
  )
}
