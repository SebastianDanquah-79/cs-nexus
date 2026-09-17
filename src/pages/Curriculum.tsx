import { useState } from 'react'
import { ArrowLeft, GraduationCap } from 'lucide-react'
import { courses, tracks, type Course } from '@/data/curriculum'
import { Bar, Panel, Source, Tag, ViewHead } from '@/components/kit'
import { masteryLevels, masteryScore, nextLevel, type MasteryRow } from '@/lib/store'

type Props = {
  mastery: MasteryRow[]
  setLevel: (courseId: string, lessonId: string, level: string) => void
  query: string
}

export default function Curriculum({ mastery, setLevel, query }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const levelOf = (id: string) => mastery.find(m => m.lesson_id === id)?.level ?? 'unseen'
  const courseScore = (c: Course) => {
    const ls = c.modules.flatMap(m => m.lessons)
    return ls.reduce((a, l) => a + masteryScore(levelOf(l.id)), 0) / ls.length
  }
  const open = courses.find(c => c.id === openId)

  if (open) return (
    <div className="view">
      <button className="secondary" onClick={() => setOpenId(null)}><ArrowLeft size={14} /> All courses</button>
      <ViewHead icon={<GraduationCap />} title={`${open.code} · ${open.title}`} text={open.description} />
      <div className="rowtags">
        <Tag tone="info">Year {open.year}</Tag><Tag>Level {open.level}</Tag><Tag>{open.credits} credits</Tag>
        {open.prerequisites.map(p => <Tag key={p} tone="warn">requires {p.toUpperCase()}</Tag>)}
        {open.resources.map(r => <Source key={r.url} label={r.label} url={r.url} />)}
      </div>
      {open.modules.map(m => (
        <Panel key={m.id} label="MODULE" title={m.title}>
          {m.lessons.map(l => {
            const level = levelOf(l.id)
            return (
              <div className="lesson" key={l.id}>
                <div className="lessonhead">
                  <div><b>{l.title}</b><p>{l.summary}</p></div>
                  <div className="lessonmeta"><Tag>{l.minutes} min</Tag><Tag tone={masteryScore(level) >= 0.6 ? 'ok' : undefined}>{level}</Tag></div>
                </div>
                <ul>{l.objectives.map(o => <li key={o}>{o}</li>)}</ul>
                <div className="task"><b>IMPLEMENT</b><span>{l.implement}</span></div>
                {l.proof && <div className="task"><b>PROVE</b><span>{l.proof}</span></div>}
                <div className="rowtags">
                  <button className="primary" onClick={() => setLevel(open.id, l.id, nextLevel(level))}>
                    Advance to {nextLevel(level)}
                  </button>
                  <select value={level} onChange={e => setLevel(open.id, l.id, e.target.value)}>
                    {masteryLevels.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            )
          })}
        </Panel>
      ))}
    </div>
  )

  const shown = courses.filter(c => (c.title + c.code + c.area).toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="view">
      <ViewHead icon={<GraduationCap />} title="Curriculum" text="Four years, three layers: university mastery, elite undergraduate depth, research capability." />
      {[1, 2, 3, 4].map(year => {
        const ys = shown.filter(c => c.year === year)
        if (!ys.length) return null
        return (
          <div key={year}>
            <div className="yearhead"><small>YEAR {year}</small><span>{ys.length} courses</span></div>
            <div className="coursegrid">
              {ys.map(c => (
                <div className="coursecard" key={c.id}>
                  <span>{c.code} · {c.area}</span>
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <Bar value={courseScore(c)} />
                  <footer>
                    <b>{Math.round(courseScore(c) * 100)}% mastery</b>
                    <button onClick={() => setOpenId(c.id)}>Open course</button>
                  </footer>
                </div>
              ))}
            </div>
          </div>
        )
      })}
      <Panel label="SPECIALIZATION" title="Tracks — recommended, never forced">
        {tracks.map(t => (
          <div className="minirow" key={t.id}>
            <b>{t.title}</b>
            <span className="fineprint">{t.courses.map(id => courses.find(c => c.id === id)?.code).join(' · ')}</span>
          </div>
        ))}
      </Panel>
    </div>
  )
}
