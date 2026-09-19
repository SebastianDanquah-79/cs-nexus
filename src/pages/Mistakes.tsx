import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Bar, Evidence, Panel, Tag, ViewHead } from '@/components/kit'
import { causes, masteryScore, type MasteryRow, type MistakeRow } from '@/lib/store'
import { allLessons } from '@/data/curriculum'

type Props = {
  mistakes: MistakeRow[]
  mastery: MasteryRow[]
  add: (row: Record<string, any>) => void
  update: (id: string, patch: Record<string, any>) => void
}

// Leitner-style intervals in days by mastery level index.
const intervals = [0, 1, 3, 7, 16, 35]

export default function Mistakes({ mistakes, mastery, add, update }: Props) {
  const [form, setForm] = useState({ topic: '', cause: causes[0], detail: '' })
  const open = mistakes.filter(m => !m.resolved)

  const byCause = causes.map(c => ({ c, n: mistakes.filter(m => m.cause === c).length }))
  const worst = byCause.slice().sort((a, b) => b.n - a.n)[0]

  const due = mastery.map(m => {
    const idx = Math.round(masteryScore(m.level) * (intervals.length - 1))
    const days = intervals[Math.min(idx, intervals.length - 1)]
    const next = new Date(new Date(m.updated_at).getTime() + days * 864e5)
    return { m, next, overdue: next.getTime() <= Date.now() }
  }).filter(x => x.overdue).slice(0, 12)

  return (
    <div className="view">
      <ViewHead icon={<AlertTriangle />} title="Mistakes & Review" text="Every significant error gets a diagnosed cause. Undiagnosed errors repeat." />

      <Panel label="FAILURE MODE ANALYSIS" title="Log a mistake">
        <div className="formgrid">
          <label className="field">topic<input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Amortized analysis of dynamic arrays" /></label>
          <label className="field">cause
            <select value={form.cause} onChange={e => setForm({ ...form, cause: e.target.value })}>{causes.map(c => <option key={c} value={c}>{c}</option>)}</select>
          </label>
        </div>
        <label className="field">what exactly went wrong<textarea rows={4} value={form.detail} onChange={e => setForm({ ...form, detail: e.target.value })} /></label>
        <button className="primary" disabled={!form.topic.trim()} onClick={() => { add(form); setForm({ topic: '', cause: causes[0], detail: '' }) }}>Log mistake</button>
      </Panel>

      <Panel label="DISTRIBUTION" title="Where your errors come from">
        {byCause.map(({ c, n }) => (
          <div className="minirow" key={c}>
            <b>{c}</b>
            <Bar value={mistakes.length ? n / mistakes.length : 0} />
            <span>{n}</span>
          </div>
        ))}
        <Evidence>{mistakes.length === 0 ? 'No mistakes logged, so no pattern can be claimed.' : `Most frequent cause: ${worst.c} (${worst.n} of ${mistakes.length}). Fix the cause, not the instance.`}</Evidence>
      </Panel>

      <Panel label="SPACED REPETITION" title={`${due.length} lessons due for retest`}>
        {due.length === 0 && <p className="empty">Nothing due. Intervals grow with demonstrated level, not with time spent.</p>}
        {due.map(({ m }) => {
          const l = allLessons.find(x => x.id === m.lesson_id)
          return <div className="minirow" key={m.id}><b>{l ? `${l.courseCode} · ${l.title}` : m.lesson_id}</b><span className="fineprint">level {m.level}</span></div>
        })}
      </Panel>

      <Panel label="OPEN" title={`${open.length} unresolved`}>
        {open.length === 0 && <p className="empty">Nothing open.</p>}
        {open.map(m => (
          <div className="lesson" key={m.id}>
            <div className="lessonhead">
              <div><b>{m.topic}</b><p>{m.detail || 'no detail recorded'}</p></div>
              <div className="lessonmeta"><Tag tone="warn">{m.cause}</Tag></div>
            </div>
            <button className="secondary" onClick={() => update(m.id, { resolved: true })}>Mark resolved — I can now explain it unaided</button>
          </div>
        ))}
      </Panel>
    </div>
  )
}
