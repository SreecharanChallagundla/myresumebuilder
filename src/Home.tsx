import { useState } from 'react'
import { parseResume } from './parse'
import type { Resume } from './types'

export default function Home({ hasSaved, onScratch, onContinue, onTailor }: {
  hasSaved: boolean
  onScratch: () => void
  onContinue: () => void
  onTailor: (r: Resume, jd: string) => void
}) {
  const [step, setStep] = useState<'choose' | 'tailor'>('choose')
  const [text, setText] = useState('')
  const [jd, setJd] = useState('')

  const loadFile = (f?: File) => {
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setText(String(reader.result ?? ''))
    reader.readAsText(f)
  }

  if (step === 'tailor') {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <button className="btn mb-4" onClick={() => setStep('choose')}>Back</button>
        <h1 className="text-2xl font-semibold mb-1">Tailor your resume to a job</h1>
        <p className="mb-5 text-[#4a5266]">Everything stays in this browser. Nothing is uploaded.</p>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="field">
              <span>1. Your current resume (plain text)</span>
              <textarea className="input" rows={16} value={text} onChange={e => setText(e.target.value)}
                placeholder={'Paste your resume text here.\nUse section titles like Summary, Experience, Education and Skills.'} />
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              <label className="btn cursor-pointer">Load a .txt or .json file
                <input type="file" accept=".txt,.md,.json" className="sr-only" onChange={e => loadFile(e.target.files?.[0])} />
              </label>
              {hasSaved && <button className="btn" onClick={onContinue}>Use the resume saved in this browser</button>}
            </div>
            <p className="text-xs text-[#5b6377]">Have a PDF or Word file? Open it, copy the text and paste it above.</p>
          </div>
          <label className="field">
            <span>2. The job description</span>
            <textarea className="input" rows={16} value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the job posting here" />
          </label>
        </div>
        <div className="mt-5">
          <button className="btn btn-primary" disabled={!text.trim()} onClick={() => onTailor(parseResume(text), jd)}>
            Import and compare
          </button>
          <span className="ml-3 text-sm text-[#5b6377]">Check the imported sections in the editor afterwards.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-2">My Resume Builder</h1>
      <p className="mb-8 text-[#4a5266]">Private by design: it runs in your browser and saves only on this device.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        <section className="bg-white border border-[var(--rule)] rounded p-5 flex flex-col">
          <h2 className="text-lg font-semibold">Build from scratch</h2>
          <p className="my-2 text-[#4a5266] flex-1">Fill in a form and watch an A4 resume take shape beside it.</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={onScratch}>Start a new resume</button>
            {hasSaved && <button className="btn" onClick={onContinue}>Continue saved resume</button>}
          </div>
        </section>
        <section className="bg-white border border-[var(--rule)] rounded p-5 flex flex-col">
          <h2 className="text-lg font-semibold">Tailor an existing resume</h2>
          <p className="my-2 text-[#4a5266] flex-1">Paste your resume and a job description. See which of the job's key terms you're missing, then edit.</p>
          <div><button className="btn btn-primary" onClick={() => setStep('tailor')}>Tailor to a job</button></div>
        </section>
      </div>
    </div>
  )
}
