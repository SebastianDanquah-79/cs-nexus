import { useState } from 'react'
import { Newspaper } from 'lucide-react'
import { briefing, news, radar, repos } from '@/data/intelligence'
import { allLessons } from '@/data/curriculum'
import { papers } from '@/data/papers'
import { Evidence, Panel, SeedBadge, Source, Tag, ViewHead } from '@/components/kit'

const statusTone = (s: string) => s === 'Mature' ? 'ok' : s === 'Declining' ? 'warn' : 'info'

export default function Intelligence({ page, query }: { page: string; query: string }) {
  const [openId, setOpenId] = useState<string | null>(null)

  if (page === 'Technology Radar') return (
    <div className="view">
      <ViewHead icon={<Newspaper />} title="Technology Radar" text="Position plus the reason for it. A radar without a why is a rumour." />
      <Panel label="RADAR" title={`${radar.length} tracked technologies`}>
        {radar.map(r => (
          <div className="lesson" key={r.id}>
            <div className="lessonhead">
              <div><b>{r.name}</b><p>{r.domain}</p></div>
              <div className="lessonmeta"><Tag tone={statusTone(r.status) as any}>{r.status}</Tag><SeedBadge /></div>
            </div>
            <div className="task"><b>WHY</b><span>{r.why}</span></div>
            <div className="rowtags"><Source label={r.source.label} url={r.source.url} /></div>
          </div>
        ))}
      </Panel>
      <Panel label="TREND DETECTOR" title="Evidence required">
        <Evidence>Trends are only reported when the underlying literature supports them. With a seeded library of {papers.length} papers, there is not enough evidence to claim a trend — that is the honest answer, not a placeholder.</Evidence>
      </Panel>
    </div>
  )

  if (page === 'Open Source Radar') return (
    <div className="view">
      <ViewHead icon={<Newspaper />} title="Open Source Radar" text="Read real systems. Contribution comes after comprehension." />
      <Panel label="PROJECTS" title={`${repos.length} reading targets`}>
        {repos.map(r => {
          const lesson = allLessons.find(l => l.id === r.relatedLesson)
          return (
            <div className="lesson" key={r.id}>
              <div className="lessonhead">
                <div><b>{r.name}</b><p>{r.purpose}</p></div>
                <div className="lessonmeta"><Tag>{r.language}</Tag></div>
              </div>
              <div className="task"><b>ARCHITECTURE</b><span>{r.architecture}</span></div>
              <div className="task"><b>CONTRIBUTE TO THIS PROJECT</b><span>{r.contribute}</span></div>
              <div className="rowtags">
                <Source label="repository" url={r.url} />
                {lesson && <Tag tone="info">studies with {lesson.courseCode} · {lesson.title}</Tag>}
              </div>
            </div>
          )
        })}
      </Panel>
    </div>
  )

  const shown = news.filter(n => (n.title + n.category).toLowerCase().includes(query.toLowerCase()))
  const open = news.find(n => n.id === openId)

  return (
    <div className="view">
      <ViewHead icon={<Newspaper />} title="AI Intelligence" text="Signal over noise: importance, reliability and a recommended action for every item." />
      <div className="metrics">
        {[['STUDY', briefing.study], ['READ', briefing.read], ['REVISE', briefing.revise], ['BUILD', briefing.build]].map(c => (
          <div className="metric" key={c[0]}><span>{c[0]}</span><strong className="smallstrong">{c[1]}</strong></div>
        ))}
      </div>

      <Panel label="TODAY IN AI" title={`${shown.length} developments that matter`} action={<SeedBadge />}>
        {shown.map(n => (
          <div className="lesson" key={n.id}>
            <div className="lessonhead">
              <div><span className="source">{n.category}</span><b>{n.title}</b><p>{n.happened}</p></div>
              <div className="lessonmeta">
                <Tag tone="info">{n.action}</Tag><Tag>Importance {n.importance}/5</Tag><Tag tone="ok">{n.source.reliability}</Tag>
              </div>
            </div>
            {openId === n.id ? <>
              <div className="task"><b>TECHNICAL SIGNIFICANCE</b><span>{n.significance}</span></div>
              <div className="task"><b>WHY IT MATTERS</b><span>{n.whyMatters}</span></div>
              <div className="task"><b>WHO IS INVOLVED</b><span>{n.who}</span></div>
              <div className="task"><b>WHAT CHANGED</b><span>{n.changed}</span></div>
              <div className="task"><b>WHAT TO LEARN</b><span>{n.learn}</span></div>
              <div className="task"><b>ENGINEERING IMPLICATIONS</b><span>{n.engineering}</span></div>
              <div className="rowtags">
                <Source label={n.source.label} url={n.source.url} />
                {n.curriculum.map(c => {
                  const l = allLessons.find(x => x.id === c.lessonId)
                  return <Tag key={c.lessonId} tone="info">{l ? `${l.courseCode} · ${l.title}` : c.label}</Tag>
                })}
              </div>
              <button className="secondary" onClick={() => setOpenId(null)}>Collapse</button>
            </> : <button className="secondary" onClick={() => setOpenId(n.id)}>Why should you care?</button>}
          </div>
        ))}
        {open === undefined && shown.length === 0 && <p className="empty">Nothing matches that search.</p>}
      </Panel>
      <Evidence>All intelligence content is seeded demonstration data with primary links, not a live retrieval feed. Dates and claims must be checked at the source.</Evidence>
    </div>
  )
}
