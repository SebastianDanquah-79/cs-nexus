import { useState } from 'react'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { papers, readingStages, stageQuestions, type Paper } from '@/data/papers'
import { allLessons } from '@/data/curriculum'
import { Evidence, Panel, SeedBadge, Source, Tag, ViewHead } from '@/components/kit'
import type { PaperProgressRow } from '@/lib/store'

type Props = {
  progress: PaperProgressRow[]
  save: (paperId: string, patch: Record<string, any>) => void
  query: string
}

const repStages = ['not started', 'dataset identified', 'baseline built', 'method implemented', 'experiment run', 'analysed', 'documented']

export default function Papers({ progress, save, query }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [tab, setTab] = useState<'teach' | 'read' | 'reproduce' | 'exam'>('teach')
  const [explanation, setExplanation] = useState('')

  const rowFor = (id: string) => progress.find(p => p.paper_id === id)
  const open = papers.find(p => p.id === openId)

  if (open) {
    const row = rowFor(open.id)
    const stageIndex = Math.max(0, readingStages.indexOf((row?.stage ?? 'Abstract') as any))
    return (
      <div className="view">
        <button className="secondary selfstart" onClick={() => setOpenId(null)}><ArrowLeft size={14} /> Observatory</button>
        <ViewHead icon={<BookOpen />} title={open.title} text={`${open.authors} · ${open.venue} ${open.year}`} />
        <div className="rowtags">
          <Tag tone="warn">{open.difficulty}</Tag><Tag>{open.category}</Tag>
          <Source label={open.arxiv ? `arXiv:${open.arxiv}` : open.url.replace('https://', '')} url={open.url} />
          <SeedBadge note="Seeded paper record — metadata and links only, read the primary source" />
        </div>

        <div className="tabs">
          {([['teach', 'Teach me the paper'], ['read', 'Read With Me'], ['reproduce', 'Reproduce This Paper'], ['exam', 'Paper exam']] as const).map(([k, l]) => (
            <button key={k} className={tab === k ? 'tab active' : 'tab'} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        {tab === 'teach' && <>
          <Panel label="30 SECONDS" title="The claim"><p className="statement">{open.thirtySeconds}</p></Panel>
          <Panel label="5 MINUTES" title="The explanation"><p className="statement">{open.fiveMinutes}</p></Panel>
          <Panel label="DEEP TECHNICAL" title="How it actually works">
            <p className="statement">{open.deep}</p>
            <div className="task"><b>WHAT EXISTED BEFORE</b><span>{open.before}</span></div>
            <div className="task"><b>MAIN CONTRIBUTION</b><span>{open.contribution}</span></div>
            <div className="task"><b>MATHEMATICAL INTUITION</b><span>{open.math}</span></div>
            <div className="task"><b>EXPERIMENTAL SETUP</b><span>{open.setup}</span></div>
            <div className="task"><b>RESULTS</b><span>{open.results}</span></div>
            <div className="task warn"><b>LIMITATIONS</b><span>{open.limitations}</span></div>
          </Panel>
          <Panel label="PREREQUISITES" title="Read these first">
            {open.prerequisites.map(p => <div className="minirow" key={p}><b>{p}</b></div>)}
            {open.prereqLessons.map(id => {
              const l = allLessons.find(x => x.id === id)
              return l ? <div className="minirow" key={id}><b>{l.courseCode} · {l.title}</b><span className="fineprint">recommended lesson</span></div> : null
            })}
          </Panel>
          <Panel label="RESEARCH OPPORTUNITIES" title="Open problems this paper leaves">
            {open.opportunities.map(o => <div className="minirow" key={o}><b>{o}</b></div>)}
            <div className="task"><b>IMPLEMENTATION CHALLENGE</b><span>{open.implement}</span></div>
          </Panel>
          <Panel label="CITATION" title="BibTeX"><pre className="code">{open.bibtex}</pre></Panel>
        </>}

        {tab === 'read' && <Panel label="READ WITH ME" title={`Stage ${stageIndex + 1} of ${readingStages.length}: ${readingStages[stageIndex]}`}>
          <p className="statement">{stageQuestions[readingStages[stageIndex]]}</p>
          <p className="fineprint">Passive scrolling does not count. Answer before advancing.</p>
          <div className="stagerail">
            {readingStages.map((s, i) => <span key={s} className={i <= stageIndex ? 'dot on' : 'dot'} title={s} />)}
          </div>
          <div className="rowtags">
            <button className="secondary" disabled={stageIndex === 0} onClick={() => save(open.id, { stage: readingStages[stageIndex - 1] })}>Back</button>
            <button className="primary" disabled={stageIndex >= readingStages.length - 1}
              onClick={() => save(open.id, { stage: readingStages[stageIndex + 1] })}>Answered — next stage</button>
          </div>
          <div className="failure">
            <b>Unaided explanation</b>
            <p>Close the paper. Explain the entire contribution in your own words — this is what counts as having read it.</p>
            <textarea rows={7} value={explanation || row?.explanation || ''} onChange={e => setExplanation(e.target.value)} placeholder="Your explanation, without looking." />
            <button className="primary" disabled={!(explanation || row?.explanation)} onClick={() => save(open.id, { explanation: explanation || row?.explanation, read_done: true })}>Save explanation and mark read</button>
            {row?.read_done && <Evidence>Marked read on your own explanation — not on scroll position.</Evidence>}
          </div>
        </Panel>}

        {tab === 'reproduce' && <Panel label="REPRODUCE THIS PAPER" title="Reproduction protocol">
          <div className="task"><b>DATASET</b><span>{open.reproduce.dataset}</span></div>
          <div className="task"><b>BASELINE</b><span>{open.reproduce.baseline}</span></div>
          <ol className="steps">{open.reproduce.steps.map(s => <li key={s}>{s}</li>)}</ol>
          <div className="task"><b>ORIGINAL RESULT TO BEAT OR MATCH</b><span>{open.reproduce.originalResult}</span></div>
          <label className="inline">Reproduction status
            <select value={row?.reproduction_status ?? 'not started'} onChange={e => save(open.id, { reproduction_status: e.target.value })}>
              {repStages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <p className="fineprint">Reproducibility score inputs: code availability, dataset availability, environment, documentation, seeds, baseline, evaluation completeness.</p>
        </Panel>}

        {tab === 'exam' && <Panel label="PAPER → EXAM" title="Graduate-level questions">
          {open.questions.map((q, i) => <div className="minirow" key={q}><b>Q{i + 1}. {q}</b></div>)}
          <div className="task warn"><b>SCIENTIFIC SKEPTIC</b><span>What evidence supports the headline claim, what contradicts it, which baseline is missing, and which confound would change the conclusion?</span></div>
        </Panel>}
      </div>
    )
  }

  const shown = papers.filter((p: Paper) => (p.title + p.authors + p.category).toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="view">
      <ViewHead icon={<BookOpen />} title="Research Observatory" text="Papers are taught, read actively and reproduced — never merely summarised." />
      <Panel label="PAPER OF THE DAY" title={papers[0].title} action={<Tag tone="warn">{papers[0].difficulty}</Tag>}>
        <p className="statement">{papers[0].thirtySeconds}</p>
        <div className="rowtags"><Source label={papers[0].url.replace('https://', '')} url={papers[0].url} /><SeedBadge /></div>
        <button className="primary" onClick={() => setOpenId(papers[0].id)}>Open reading mode</button>
      </Panel>
      <Panel label="LIBRARY" title={`${shown.length} papers`}>
        {shown.map(p => {
          const row = rowFor(p.id)
          return (
            <button className="row rowbutton" key={p.id} onClick={() => setOpenId(p.id)}>
              <span className="index">{p.year}</span>
              <div><b>{p.title}</b><p>{p.authors} · {p.venue} · {p.category}</p></div>
              <span className="rowtags">
                <Tag tone={row?.read_done ? 'ok' : undefined}>{row?.read_done ? 'read' : p.difficulty}</Tag>
                {row && row.reproduction_status !== 'not started' && <Tag tone="info">{row.reproduction_status}</Tag>}
              </span>
            </button>
          )
        })}
      </Panel>
    </div>
  )
}
