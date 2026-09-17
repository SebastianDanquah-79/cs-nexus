import { useMemo, useState } from 'react'
import { Terminal, Timer } from 'lucide-react'
import { modeLabels, problems, tiers, type Mode, type Problem } from '@/data/problems'
import { Panel, Tag, ViewHead } from '@/components/kit'
import { causes, type AttemptRow } from '@/lib/store'

type Props = {
  attempts: AttemptRow[]
  saveAttempt: (row: { problem_id: string; mode: string; answer: string; self_score: number; minutes: number }) => void
  logMistake: (row: { topic: string; cause: string; detail: string }) => void
}

const modes: Mode[] = ['interleaved', 'blind', 'redteam', 'proof', 'teachback']

export default function Practice({ attempts, saveAttempt, logMistake }: Props) {
  const [mode, setMode] = useState<Mode | 'all'>('all')
  const [tier, setTier] = useState<string>('all')
  const [current, setCurrent] = useState<Problem | null>(null)
  const [answer, setAnswer] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(3)
  const [cause, setCause] = useState(causes[0])

  const pool = useMemo(() => problems.filter(p => (mode === 'all' || p.mode === mode) && (tier === 'all' || p.tier === tier)), [mode, tier])

  const start = (p: Problem) => { setCurrent(p); setAnswer(''); setRevealed(false); setScore(3) }

  const submit = () => {
    if (!current) return
    setRevealed(true)
    saveAttempt({ problem_id: current.id, mode: current.mode, answer, self_score: score, minutes: current.minutes })
  }

  return (
    <div className="view">
      <ViewHead icon={<Terminal />} title="Practice & Exams" text="Difficulty comes from abstraction, unfamiliarity and depth — never from confusion." />

      <div className="filters">
        <select value={mode} onChange={e => { setMode(e.target.value as Mode); setCurrent(null) }}>
          <option value="all">All modes</option>
          {modes.map(m => <option key={m} value={m}>{modeLabels[m]}</option>)}
        </select>
        <select value={tier} onChange={e => { setTier(e.target.value); setCurrent(null) }}>
          <option value="all">All difficulty tiers</option>
          {tiers.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="primary" onClick={() => start(pool[Math.floor(Math.random() * pool.length)] ?? problems[0])}>
          Give me something hard
        </button>
      </div>

      {current && (
        <Panel label={modeLabels[current.mode].toUpperCase()} title={current.title}
          action={<span className="rowtags"><Tag tone="warn">{current.tier}</Tag><Tag><Timer size={11} /> {current.minutes} min</Tag></span>}>
          <p className="statement">{current.statement}</p>
          {current.mode !== 'interleaved' && <div className="rowtags">{current.topics.map(t => <Tag key={t}>{t}</Tag>)}</div>}
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={8}
            placeholder={current.mode === 'teachback' ? 'Teach it. Shapes, derivations, no hand-waving.' : 'Write your full reasoning before revealing anything.'} />
          <div className="rowtags">
            <label className="inline">Self-assessment
              <select value={score} onChange={e => setScore(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v} / 5</option>)}
              </select>
            </label>
            <button className="primary" disabled={!answer.trim()} onClick={submit}>Submit and compare</button>
          </div>

          {revealed && <>
            <div className="task"><b>WHAT A STRONG ANSWER CONTAINS</b><span>{current.expected}</span></div>
            <div className="task warn"><b>THE TRAP</b><span>{current.trap}</span></div>
            <div className="failure">
              <b>Failure mode analysis</b>
              <p>If your answer fell short, diagnose it now — undiagnosed errors repeat.</p>
              <div className="rowtags">
                <select value={cause} onChange={e => setCause(e.target.value)}>{causes.map(c => <option key={c} value={c}>{c}</option>)}</select>
                <button className="secondary" onClick={() => logMistake({ topic: `${current.title} (${current.topics[0]})`, cause, detail: answer.slice(0, 500) })}>
                  Log this mistake
                </button>
              </div>
            </div>
          </>}
        </Panel>
      )}

      <Panel label="PROBLEM BANK" title={`${pool.length} original problems`}>
        {pool.map(p => (
          <button className="row rowbutton" key={p.id} onClick={() => start(p)}>
            <span className="index">{p.tier.split(' ')[0].slice(0, 5).toUpperCase()}</span>
            <div><b>{p.title}</b><p>{modeLabels[p.mode]}</p></div>
            <Tag>{p.minutes} min</Tag>
          </button>
        ))}
      </Panel>

      <Panel label="RECORD" title="Your attempts">
        {attempts.length === 0 && <p className="empty">No attempts recorded yet.</p>}
        {attempts.slice().reverse().slice(0, 12).map(a => (
          <div className="minirow" key={a.id}>
            <b>{problems.find(p => p.id === a.problem_id)?.title ?? a.problem_id}</b>
            <span className="fineprint">{a.mode} · self {a.self_score ?? '—'}/5 · {new Date(a.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </Panel>
    </div>
  )
}
