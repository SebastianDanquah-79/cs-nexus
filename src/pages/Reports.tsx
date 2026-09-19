import { BarChart3 } from 'lucide-react'
import { Bar, Evidence, Panel, Tag, ViewHead } from '@/components/kit'
import { allLessons, courses } from '@/data/curriculum'
import { masteryScore, type AttemptRow, type ExperimentRow, type MasteryRow, type MistakeRow, type PaperProgressRow, type UniCourseRow } from '@/lib/store'

type Props = {
  mastery: MasteryRow[]
  mistakes: MistakeRow[]
  attempts: AttemptRow[]
  experiments: ExperimentRow[]
  paperProgress: PaperProgressRow[]
  uni: UniCourseRow[]
}

const stages = ['Beginner', 'Competent', 'Strong undergraduate', 'Advanced undergraduate', 'Research-capable', 'Independent engineer/researcher']

export default function Reports({ mastery, mistakes, attempts, experiments, paperProgress, uni }: Props) {
  const total = allLessons.length
  const avg = total ? mastery.reduce((a, m) => a + masteryScore(m.level), 0) / total : 0
  const read = paperProgress.filter(p => p.read_done).length
  const stageIndex = Math.min(stages.length - 1, Math.floor(avg * 6 + Math.min(read, 3) * 0.2))

  const week = attempts.filter(a => Date.now() - new Date(a.created_at).getTime() < 7 * 864e5)
  const weakCourses = courses.map(c => {
    const ls = c.modules.flatMap(m => m.lessons)
    const s = ls.reduce((a, l) => a + masteryScore(mastery.find(m => m.lesson_id === l.id)?.level ?? 'unseen'), 0) / ls.length
    return { c, s }
  }).sort((a, b) => a.s - b.s)

  const graded = uni.filter(u => u.grade_points !== null)
  const credits = graded.reduce((a, u) => a + u.credits, 0)
  const gpa = credits ? graded.reduce((a, u) => a + u.credits * (u.grade_points ?? 0), 0) / credits : null

  return (
    <div className="view">
      <ViewHead icon={<BarChart3 />} title="Reports & Analytics" text="Honest numbers only: everything below is computed from work you recorded." />

      <Panel label="LONG-TERM DEVELOPMENT MODEL" title={stages[stageIndex]} action={<Tag tone="info">{Math.round(avg * 100)}% curriculum mastery</Tag>}>
        {stages.map((s, i) => <div className="minirow" key={s}><b>{s}</b><Bar value={i <= stageIndex ? 1 : 0} /><span>{i <= stageIndex ? 'reached' : '—'}</span></div>)}
        <Evidence>Stage is derived from advanced mastery levels and papers completed with an unaided explanation. It is not a claim of equivalence to any named university programme.</Evidence>
      </Panel>

      <div className="metrics">
        {[
          ['Attempts this week', String(week.length), 'unseen problems'],
          ['Papers read', String(read), 'own explanation saved'],
          ['Experiments', String(experiments.length), 'logged runs'],
          ['Cumulative GPA', gpa === null ? '—' : gpa.toFixed(2), `${credits} graded credits`],
        ].map(c => <div className="metric" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><em>{c[2]}</em></div>)}
      </div>

      <Panel label="WEAKEST AREAS" title="Where to spend the next month">
        {weakCourses.slice(0, 6).map(({ c, s }) => (
          <div className="minirow" key={c.id}><b>{c.code} · {c.title}</b><Bar value={s} /><span>{Math.round(s * 100)}%</span></div>
        ))}
      </Panel>

      <Panel label="WEEKLY RESEARCH MEETING" title="Sunday agenda">
        {['What did you learn?', 'What did you build?', 'What failed, and why?', 'What surprised you?', 'Which paper sections did you read?', 'Which concepts are still weak?', 'Which research question interests you now?'].map(q => (
          <div className="minirow" key={q}><b>{q}</b></div>
        ))}
        <Evidence>{mistakes.length === 0 ? 'No mistakes logged this period — either an unusually clean week or an unrecorded one.' : `${mistakes.filter(m => !m.resolved).length} unresolved mistakes to bring to this meeting.`}</Evidence>
      </Panel>

      <Panel label="MONTHLY TECHNICAL REVIEW" title="Computed inputs">
        <table className="dtable">
          <thead><tr><th>Dimension</th><th>Evidence</th></tr></thead>
          <tbody>
            {[
              ['Lessons advanced', `${mastery.length} of ${total}`],
              ['Mastery ≥ explained', `${mastery.filter(m => masteryScore(m.level) >= 0.6).length}`],
              ['Problem attempts', `${attempts.length}`],
              ['Mistakes diagnosed', `${mistakes.length}`],
              ['Papers read / reproduced', `${read} / ${paperProgress.filter(p => p.reproduction_status === 'documented').length}`],
              ['University courses tracked', `${uni.length}`],
            ].map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td></tr>)}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}
