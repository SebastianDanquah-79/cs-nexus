import { useState } from 'react'
import { Gauge } from 'lucide-react'
import { Evidence, Panel, Tag, ViewHead } from '@/components/kit'
import type { UniCourseRow } from '@/lib/store'

type Props = {
  rows: UniCourseRow[]
  add: (row: Record<string, any>) => void
  update: (id: string, patch: Record<string, any>) => void
  remove: (id: string) => void
}

const points = [['A', 4], ['A-', 3.7], ['B+', 3.3], ['B', 3], ['B-', 2.7], ['C+', 2.3], ['C', 2], ['D', 1], ['F', 0]] as const

export default function GPA({ rows, add, update, remove }: Props) {
  const [form, setForm] = useState({ code: '', title: '', credits: 3, semester: '', grade_points: 4, target_points: 4 })

  const graded = rows.filter(r => r.grade_points !== null)
  const credits = graded.reduce((a, r) => a + r.credits, 0)
  const gpa = credits ? graded.reduce((a, r) => a + r.credits * (r.grade_points ?? 0), 0) / credits : 0
  const targetCredits = rows.reduce((a, r) => a + r.credits, 0)
  const targetGpa = targetCredits ? rows.reduce((a, r) => a + r.credits * (r.target_points ?? r.grade_points ?? 0), 0) / targetCredits : 0
  const remaining = targetCredits - credits
  const needed = remaining > 0 ? (4 * targetCredits - gpa * credits) / remaining : 0

  return (
    <div className="view">
      <ViewHead icon={<Gauge />} title="GPA Engine" text="Your real university record — entered by you, computed exactly, never estimated." />

      <div className="metrics">
        {[
          ['Cumulative GPA', credits ? gpa.toFixed(2) : '—', `${credits} graded credits`],
          ['Projected GPA', targetCredits ? targetGpa.toFixed(2) : '—', 'using your targets'],
          ['Credits enrolled', String(targetCredits), `${remaining} ungraded`],
          ['Needed for 4.00', remaining > 0 ? (needed > 4 ? 'not reachable' : needed.toFixed(2)) : '—', 'average on remaining credits'],
        ].map(c => <div className="metric" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><em>{c[2]}</em></div>)}
      </div>

      <Panel label="ENTER A COURSE" title="Use your university's own grading scheme">
        <div className="formgrid">
          <label className="field">code<input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="CSM157" /></label>
          <label className="field">title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label>
          <label className="field">credits<input type="number" min={1} max={12} value={form.credits} onChange={e => setForm({ ...form, credits: Number(e.target.value) })} /></label>
          <label className="field">semester<input value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} placeholder="2026/1" /></label>
          <label className="field">grade
            <select value={form.grade_points} onChange={e => setForm({ ...form, grade_points: Number(e.target.value) })}>
              <option value={-1}>not graded yet</option>
              {points.map(([l, v]) => <option key={l} value={v}>{l} · {v.toFixed(1)}</option>)}
            </select>
          </label>
          <label className="field">target
            <select value={form.target_points} onChange={e => setForm({ ...form, target_points: Number(e.target.value) })}>
              {points.map(([l, v]) => <option key={l} value={v}>{l} · {v.toFixed(1)}</option>)}
            </select>
          </label>
        </div>
        <button className="primary" disabled={!form.code.trim()} onClick={() => {
          add({ ...form, grade_points: form.grade_points < 0 ? null : form.grade_points })
          setForm({ code: '', title: '', credits: 3, semester: '', grade_points: 4, target_points: 4 })
        }}>Add course</button>
      </Panel>

      <Panel label="RECORD" title={`${rows.length} university courses`}>
        {rows.length === 0 && <p className="empty">No courses entered. Nothing is assumed about your university.</p>}
        {rows.length > 0 && <table className="dtable">
          <thead><tr><th>Code</th><th>Title</th><th>Credits</th><th>Semester</th><th>Grade</th><th>Target</th><th /></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.code}</td><td>{r.title}</td><td>{r.credits}</td><td>{r.semester || '—'}</td>
                <td>
                  <select value={r.grade_points ?? -1} onChange={e => update(r.id, { grade_points: Number(e.target.value) < 0 ? null : Number(e.target.value) })}>
                    <option value={-1}>—</option>
                    {points.map(([l, v]) => <option key={l} value={v}>{l}</option>)}
                  </select>
                </td>
                <td>
                  <select value={r.target_points ?? 4} onChange={e => update(r.id, { target_points: Number(e.target.value) })}>
                    {points.map(([l, v]) => <option key={l} value={v}>{l}</option>)}
                  </select>
                </td>
                <td><button className="secondary" onClick={() => remove(r.id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>}
      </Panel>

      <Panel label="A-LEVEL READINESS" title="Scenario analysis" action={<Tag tone={needed > 0 && needed <= 4 ? 'ok' : 'warn'}>{credits ? 'evidence-based' : 'no evidence yet'}</Tag>}>
        <Evidence>
          {credits === 0
            ? 'No graded credits entered, so no readiness claim can be made.'
            : `With ${credits} graded credits at ${gpa.toFixed(2)}, reaching a 4.00 cumulative requires a ${needed <= 4 ? needed.toFixed(2) : 'above-maximum'} average across the remaining ${remaining} credits.`}
        </Evidence>
      </Panel>
    </div>
  )
}
