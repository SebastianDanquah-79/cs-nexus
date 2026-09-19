import { Code2 } from 'lucide-react'
import { Evidence, Panel, Source, Tag, ViewHead } from '@/components/kit'
import { allLessons, courses } from '@/data/curriculum'
import { papers } from '@/data/papers'
import { masteryScore, type AttemptRow, type ExperimentRow, type IdeaRow, type MasteryRow, type PaperProgressRow } from '@/lib/store'

type Props = {
  name: string
  mastery: MasteryRow[]
  attempts: AttemptRow[]
  experiments: ExperimentRow[]
  ideas: IdeaRow[]
  paperProgress: PaperProgressRow[]
}

export default function Portfolio({ name, mastery, attempts, experiments, ideas, paperProgress }: Props) {
  const mastered = mastery.filter(m => masteryScore(m.level) >= 0.6)
  const applied = mastery.filter(m => m.level === 'applied')
  const read = paperProgress.filter(p => p.read_done)
  const reproduced = paperProgress.filter(p => p.reproduction_status === 'documented')

  return (
    <div className="view">
      <ViewHead icon={<Code2 />} title="Technical Portfolio" text="Assembled only from work you actually recorded. Nothing here is decorative." />

      <div className="metrics">
        {[
          ['Lessons mastered', `${mastered.length}`, 'level ≥ explained'],
          ['Implementations applied', `${applied.length}`, 'level = applied'],
          ['Papers read unaided', `${read.length} / ${papers.length}`, 'own explanation saved'],
          ['Experiments logged', `${experiments.length}`, `${reproduced.length} reproductions documented`],
        ].map(c => <div className="metric" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><em>{c[2]}</em></div>)}
      </div>

      <Panel label="PROFILE" title={name}>
        <p className="statement">Computer science, engineering and research record. Claims below are backed by stored evidence: advanced mastery levels, saved paper explanations, logged experiments and recorded problem attempts.</p>
        <Evidence>Usage of this workspace is not equivalent to any particular university programme. Assessment comes from demonstrated work only.</Evidence>
      </Panel>

      <Panel label="ALGORITHMS & SYSTEMS IMPLEMENTED" title={`${applied.length} applied`}>
        {applied.length === 0 && <p className="empty">Nothing yet. A lesson reaches &ldquo;applied&rdquo; only after you use it in real work.</p>}
        {applied.map(m => {
          const l = allLessons.find(x => x.id === m.lesson_id)
          return <div className="minirow" key={m.id}><b>{l ? `${l.courseCode} · ${l.title}` : m.lesson_id}</b><span className="fineprint">{l?.implement}</span></div>
        })}
      </Panel>

      <Panel label="PAPERS" title="Read and reproduced">
        {read.length === 0 && <p className="empty">No papers completed with an unaided explanation yet.</p>}
        {read.map(p => {
          const paper = papers.find(x => x.id === p.paper_id)
          if (!paper) return null
          return (
            <div className="lesson" key={p.id}>
              <div className="lessonhead">
                <div><b>{paper.title}</b><p>{paper.authors} · {paper.venue} {paper.year}</p></div>
                <div className="lessonmeta"><Tag tone="ok">read</Tag><Tag tone="info">{p.reproduction_status}</Tag></div>
              </div>
              {p.explanation && <div className="task"><b>YOUR EXPLANATION</b><span>{p.explanation}</span></div>}
              <div className="rowtags"><Source label={paper.url.replace('https://', '')} url={paper.url} /></div>
            </div>
          )
        })}
      </Panel>

      <Panel label="EXPERIMENTS" title={`${experiments.length} runs`}>
        {experiments.length === 0 && <p className="empty">No runs recorded.</p>}
        {experiments.map(e => <div className="minirow" key={e.id}><b>{e.title}</b><span className="fineprint">{e.model || '—'} · {e.result || 'no result'} · {e.status}</span></div>)}
      </Panel>

      <Panel label="RESEARCH INTERESTS" title={`${ideas.length} ideas on record`}>
        {ideas.length === 0 && <p className="empty">Empty.</p>}
        {ideas.map(i => <div className="minirow" key={i.id}><b>{i.title}</b><span className="fineprint">{i.difficulty}</span></div>)}
      </Panel>

      <Panel label="PRACTICE RECORD" title={`${attempts.length} attempts on unseen problems`}>
        {courses.slice(0, 0).map(() => null)}
        {attempts.length === 0 && <p className="empty">No attempts recorded.</p>}
        {attempts.slice().reverse().slice(0, 10).map(a => (
          <div className="minirow" key={a.id}><b>{a.problem_id}</b><span className="fineprint">{a.mode} · self {a.self_score ?? '—'}/5</span></div>
        ))}
      </Panel>
    </div>
  )
}
