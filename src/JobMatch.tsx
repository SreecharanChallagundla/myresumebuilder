import { analyze } from './match'
import { uid } from './types'
import type { Resume } from './types'

export default function JobMatch({ data, setData, jd, setJd }: {
  data: Resume; setData: (r: Resume) => void; jd: string; setJd: (s: string) => void
}) {
  const res = analyze(data, jd)

  const addSkill = (word: string) => {
    const g = data.skills.find(s => s.label === 'Job keywords')
    setData({
      ...data,
      skills: g
        ? data.skills.map(s => (s === g ? { ...s, items: s.items ? `${s.items}, ${word}` : word } : s))
        : [...data.skills, { id: uid(), label: 'Job keywords', items: word }],
    })
  }

  return (
    <div className="space-y-5">
      <label className="field">
        <span>Job description</span>
        <textarea className="input" rows={7} value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job description here" />
      </label>

      {!jd.trim() ? (
        <p className="text-sm text-[#5b6377]">Paste a job description to see which of its key terms your resume already uses.</p>
      ) : (
        <>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <strong>Keyword match</strong><span>{res.score}%</span>
            </div>
            <div className="h-2 rounded bg-[var(--rule)]" role="progressbar" aria-valuenow={res.score} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-2 rounded bg-[var(--accent)]" style={{ width: `${res.score}%` }} />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Missing from your resume ({res.missing.length})</h3>
            {res.missing.length === 0 ? <p className="text-sm">Nothing missing. Nice.</p> : (
              <div className="flex flex-wrap gap-2">
                {res.missing.map(w => (
                  <button key={w} className="btn" title="Add to the Job keywords skill group" onClick={() => addSkill(w)}>+ {w}</button>
                ))}
              </div>
            )}
            <p className="text-xs text-[#5b6377] mt-2">
              Add a term only if it is true for you. Better still, reword a bullet in the Edit tab to show where you used it.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2">Already covered ({res.matched.length})</h3>
            <div className="flex flex-wrap gap-2">
              {res.matched.map(w => <span key={w} className="px-2 py-1 rounded text-sm bg-[#dfe9f2] text-[#17395a]">{w}</span>)}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
