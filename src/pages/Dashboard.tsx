import { ArrowRight, BookOpen, Brain, CheckCircle2, Newspaper, Terminal } from 'lucide-react'
import { allLessons } from '@/data/curriculum'
import { briefing, news } from '@/data/intelligence'
import { papers } from '@/data/papers'
import { problems } from '@/data/problems'
import { Panel, SeedBadge, Source, Tag, Bar } from '@/components/kit'
import { masteryScore, type MasteryRow, type MistakeRow } from '@/lib/store'

type Props = {
  name: string
  mastery: MasteryRow[]
  mistakes: MistakeRow[]
  nav: (page: string) => void
}

export default function Dashboard({ name, mastery, mistakes, nav }: Props) {
  const done = mastery.filter(m => masteryScore(m.level) >= 0.6).length
  const total = allLessons.length
  const nextLesson = allLessons.find(l => !mastery.some(m => m.lesson_id === l.id)) ?? allLessons[0]
  const weak = mistakes.filter(m => !m.resolved).slice(0, 3)
  const paper = papers[0]
  const hard = problems.find(p => p.tier === 'Elite undergraduate') ?? problems[0]
  const top = news.slice(0, 3)

  const routine = [
    ['LEARN', nextLesson.title, `${nextLesson.courseCode} · ${nextLesson.minutes} min`, 'Curriculum'],
    ['SOLVE', hard.title, `${hard.tier} · ${hard.minutes} min`, 'Practice & Exams'],
    ['CODE', nextLesson.implement, 'Implementation challenge', 'Curriculum'],
    ['READ', briefing.read, 'One paper section, actively', 'Research Observatory'],
    ['THINK', hard.trap, 'The conceptual trap to survive', 'Practice & Exams'],
    ['BUILD', briefing.build, 'One small engineering task', 'Research & Model Lab'],
    ['NEWS', top.map(n => n.title.slice(0, 42)).join(' · '), 'Three developments', 'AI Intelligence'],
    ['REVIEW', briefing.revise, 'Spaced repetition target', 'Mistakes & Review'],
    ['REFLECT', 'What did you misunderstand today?', 'Log it as a mistake with a cause', 'Mistakes & Review'],
  ]

  return <>
    <div className="hero">
      <div>
        <small>COMPUTATION INSTITUTE</small>
        <h2>Build. Prove. Reproduce.</h2>
        <p>{name} — evidence of competence, not completion. {done} of {total} lessons carry demonstrated mastery.</p>
      </div>
      <button className="primary" onClick={() => nav('Curriculum')}>Start today&apos;s plan <ArrowRight size={15} /></button>
    </div>

    <div className="metrics">
      {[
        ['Lessons mastered', `${done} / ${total}`, 'Level ≥ explained'],
        ['Open mistakes', String(mistakes.filter(m => !m.resolved).length), 'Diagnosed by cause'],
        ['Papers in library', String(papers.length), 'All primary sources'],
        ['Problems available', String(problems.length), 'Original, unseen'],
      ].map(c => <div className="metric" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><em>{c[2]}</em></div>)}
    </div>

    <div className="grid">
      <Panel label="DAILY INTELLECTUAL ROUTINE" title="Nine obligations" action={<button onClick={() => nav('Curriculum')}>Curriculum →</button>}>
        {routine.map(r => (
          <button className="row rowbutton" key={r[0]} onClick={() => nav(r[3] as string)}>
            <span className="index">{r[0]}</span>
            <div><b>{r[1]}</b><p>{r[2]}</p></div>
            <ArrowRight size={14} />
          </button>
        ))}
      </Panel>

      <div className="stack">
        <Panel label="MASTERY SIGNAL" title="Where you actually stand">
          {['cs101', 'math110', 'cs201', 'cs301', 'cs410'].map(id => {
            const lessons = allLessons.filter(l => l.courseId === id)
            const score = lessons.length ? lessons.reduce((a, l) => a + masteryScore(mastery.find(m => m.lesson_id === l.id)?.level ?? 'unseen'), 0) / lessons.length : 0
            return <div className="minirow" key={id}><b>{lessons[0]?.courseCode ?? id}</b><Bar value={score} /><span>{Math.round(score * 100)}%</span></div>
          })}
          <p className="fineprint">Derived only from lessons you advanced yourself. No estimated numbers.</p>
        </Panel>

        <Panel label="WEAKNESSES" title="Repeating mistakes" action={<button onClick={() => nav('Mistakes & Review')}>All →</button>}>
          {weak.length === 0 && <p className="empty">Nothing logged yet. After every significant error, record the cause.</p>}
          {weak.map(m => <div className="research" key={m.id}><div className="pulse" /><div><b>{m.topic}</b><p>{m.cause}</p></div></div>)}
        </Panel>
      </div>
    </div>

    <div className="bottom">
      <Panel label="TODAY IN AI" title="Signal, not noise" action={<button onClick={() => nav('AI Intelligence')}>Full briefing →</button>}>
        {top.map(n => (
          <article key={n.id}>
            <span className="source">{n.category} <SeedBadge /></span>
            <b>{n.title}</b>
            <p>{n.whyMatters}</p>
            <div className="rowtags"><Tag tone="info">{n.action}</Tag><Tag>Importance {n.importance}/5</Tag><Source label={n.source.label} url={n.source.url} /></div>
          </article>
        ))}
      </Panel>

      <section className="panel quick">
        <small>NEXT ACTION</small>
        <h3>{paper.title}</h3>
        <p>{paper.thirtySeconds}</p>
        <div className="rowtags"><Tag>{paper.difficulty}</Tag><Source label={paper.url.replace('https://', '')} url={paper.url} /></div>
        <button className="primary full" onClick={() => nav('Research Observatory')}><BookOpen size={14} /> Read with the professor</button>
        <button className="secondary full" onClick={() => nav('Practice & Exams')}><Terminal size={14} /> Give me something hard</button>
        <button className="secondary full" onClick={() => nav('AI Faculty')}><Brain size={14} /> Ask the faculty</button>
        <p className="fineprint"><CheckCircle2 size={12} /> Completion ≠ understanding ≠ mastery ≠ research ability.</p>
        <p className="fineprint"><Newspaper size={12} /> Intelligence content is seeded demonstration data with primary links.</p>
      </section>
    </div>
  </>
}
