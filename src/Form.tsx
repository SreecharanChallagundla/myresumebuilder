import type { ReactNode } from 'react'
import { uid } from './types'
import type { Resume, Basics, Experience, Education, SkillGroup } from './types'

function Field({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <label className="field">
      <span>{label}</span>
      {area
        ? <textarea className="input" rows={4} value={value} onChange={e => onChange(e.target.value)} />
        : <input className="input" value={value} onChange={e => onChange(e.target.value)} />}
    </label>
  )
}

function move<T>(list: T[], i: number, d: -1 | 1): T[] {
  const j = i + d
  if (j < 0 || j >= list.length) return list
  const copy = [...list]
  ;[copy[i], copy[j]] = [copy[j], copy[i]]
  return copy
}

function ListSection<T extends { id: string }>(props: {
  title: string; addLabel: string; items: T[]; make: () => T
  onChange: (items: T[]) => void
  render: (item: T, update: (p: Partial<T>) => void) => ReactNode
}) {
  const { items, onChange } = props
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold">{props.title}</h2>
      {items.length === 0 && <p className="text-sm text-[#5b6377]">Nothing here yet. Add your first entry.</p>}
      {items.map((it, i) => (
        <div key={it.id} className="border border-[var(--rule)] rounded p-3 bg-white space-y-2">
          {props.render(it, p => onChange(items.map(x => (x.id === it.id ? { ...x, ...p } : x))))}
          <div className="flex gap-2 pt-1">
            <button className="btn" onClick={() => onChange(move(items, i, -1))} disabled={i === 0}>Move up</button>
            <button className="btn" onClick={() => onChange(move(items, i, 1))} disabled={i === items.length - 1}>Move down</button>
            <button className="btn" onClick={() => onChange(items.filter(x => x.id !== it.id))}>Remove</button>
          </div>
        </div>
      ))}
      <button className="btn" onClick={() => onChange([...items, props.make()])}>{props.addLabel}</button>
    </section>
  )
}

export default function Form({ data, setData }: { data: Resume; setData: (r: Resume) => void }) {
  const setBasic = (k: keyof Basics) => (v: string) => setData({ ...data, basics: { ...data.basics, [k]: v } })
  const b = data.basics
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Personal details</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full name" value={b.name} onChange={setBasic('name')} />
          <Field label="Job title" value={b.title} onChange={setBasic('title')} />
          <Field label="Email" value={b.email} onChange={setBasic('email')} />
          <Field label="Phone" value={b.phone} onChange={setBasic('phone')} />
          <Field label="Location" value={b.location} onChange={setBasic('location')} />
          <Field label="Website or profile" value={b.link} onChange={setBasic('link')} />
        </div>
        <Field label="Summary" value={b.summary} onChange={setBasic('summary')} area />
      </section>

      <ListSection<Experience>
        title="Experience" addLabel="Add job" items={data.experience}
        make={() => ({ id: uid(), company: '', role: '', start: '', end: '', bullets: '' })}
        onChange={experience => setData({ ...data, experience })}
        render={(x, u) => (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Role" value={x.role} onChange={v => u({ role: v })} />
              <Field label="Company" value={x.company} onChange={v => u({ company: v })} />
              <Field label="Start" value={x.start} onChange={v => u({ start: v })} />
              <Field label="End" value={x.end} onChange={v => u({ end: v })} />
            </div>
            <Field label="Achievements (one per line)" value={x.bullets} onChange={v => u({ bullets: v })} area />
          </>
        )}
      />

      <ListSection<Education>
        title="Education" addLabel="Add school" items={data.education}
        make={() => ({ id: uid(), school: '', degree: '', start: '', end: '' })}
        onChange={education => setData({ ...data, education })}
        render={(x, u) => (
          <div className="grid grid-cols-2 gap-3">
            <Field label="School" value={x.school} onChange={v => u({ school: v })} />
            <Field label="Degree" value={x.degree} onChange={v => u({ degree: v })} />
            <Field label="Start" value={x.start} onChange={v => u({ start: v })} />
            <Field label="End" value={x.end} onChange={v => u({ end: v })} />
          </div>
        )}
      />

      <ListSection<SkillGroup>
        title="Skills" addLabel="Add skill group" items={data.skills}
        make={() => ({ id: uid(), label: '', items: '' })}
        onChange={skills => setData({ ...data, skills })}
        render={(x, u) => (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Group name" value={x.label} onChange={v => u({ label: v })} />
            <Field label="Skills (comma separated)" value={x.items} onChange={v => u({ items: v })} />
          </div>
        )}
      />
    </div>
  )
}
