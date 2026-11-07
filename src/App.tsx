import { useState } from 'react'
import Form from './Form'
import Home from './Home'
import JobMatch from './JobMatch'
import Preview from './Preview'
import { useLocalStorage } from './useLocalStorage'
import { blankResume, sampleResume } from './types'
import type { Resume } from './types'

type Mode = 'home' | 'scratch' | 'tailor'

export default function App() {
  const [data, setData] = useLocalStorage<Resume>('myresumebuilder:v1', sampleResume)
  const [jd, setJd] = useLocalStorage<string>('myresumebuilder:jd', () => '')
  const [mode, setMode] = useState<Mode>('home')
  const [tab, setTab] = useState<'edit' | 'match'>('edit')

  const reset = () => {
    if (window.confirm('Clear everything and start with a blank resume? This cannot be undone.')) setData(blankResume())
  }

  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'resume.json'; a.click()
    URL.revokeObjectURL(url)
  }

  if (mode === 'home') {
    return (
      <Home
        hasSaved
        onScratch={() => { setData(blankResume()); setTab('edit'); setMode('scratch') }}
        onContinue={() => { setTab('edit'); setMode('scratch') }}
        onTailor={(r, j) => { setData(r); setJd(j); setTab(j.trim() ? 'match' : 'edit'); setMode('tailor') }}
      />
    )
  }

  const tailoring = mode === 'tailor'
  return (
    <div className="h-screen flex flex-col">
      <div id="toolbar" className="flex items-center justify-between px-4 py-2 bg-[var(--panel)] border-b border-[var(--rule)]">
        <div className="flex items-center gap-3">
          <button className="btn" onClick={() => setMode('home')}>Home</button>
          <h1 className="font-semibold">{tailoring ? 'Tailor to a job' : 'Build a resume'}</h1>
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={exportJson}>Export JSON</button>
          <button className="btn" onClick={reset}>Clear all</button>
          <button className="btn btn-primary" onClick={() => window.print()}>Save as PDF</button>
        </div>
      </div>
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(340px,480px)_1fr]">
        <aside id="editor" className="overflow-y-auto p-4 bg-[var(--panel)] border-r border-[var(--rule)]">
          {tailoring && (
            <div className="flex gap-2 mb-4" role="tablist">
              <button role="tab" aria-selected={tab === 'edit'} className={`btn ${tab === 'edit' ? 'btn-primary' : ''}`} onClick={() => setTab('edit')}>Edit</button>
              <button role="tab" aria-selected={tab === 'match'} className={`btn ${tab === 'match' ? 'btn-primary' : ''}`} onClick={() => setTab('match')}>Job match</button>
            </div>
          )}
          {tailoring && tab === 'match'
            ? <JobMatch data={data} setData={setData} jd={jd} setJd={setJd} />
            : <Form data={data} setData={setData} />}
        </aside>
        <main id="stage" className="overflow-auto p-6 flex justify-center items-start">
          <Preview data={data} />
        </main>
      </div>
    </div>
  )
}
