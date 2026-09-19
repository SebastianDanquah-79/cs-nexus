import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import { papers } from '@/data/papers'
import { Evidence, Panel, Tag, ViewHead } from '@/components/kit'
import type { ExperimentRow, IdeaRow } from '@/lib/store'

type Props = {
  experiments: ExperimentRow[]
  addExperiment: (row: Record<string, any>) => void
  ideas: IdeaRow[]
  addIdea: (row: Record<string, any>) => void
}

const workflow = [
  ['Research question', 'Stated as a falsifiable question, not a topic.'],
  ['Literature review', 'What exists, what fails, and where the gap is — with citations.'],
  ['Hypothesis', 'A prediction that could be wrong.'],
  ['Methodology', 'Baselines, controls, metrics and the confound you are guarding against.'],
  ['Implementation', 'Code with fixed seeds and a recorded environment.'],
  ['Experiment', 'Run, log, and keep the failures.'],
  ['Evaluation', 'Multiple metrics; state the tradeoff you accepted.'],
  ['Analysis', 'Explain discrepancies instead of hiding them.'],
  ['Paper', 'Claims no stronger than the evidence.'],
  ['Peer review', 'Three hostile reviewers before you believe yourself.'],
  ['Revision', 'Address every major concern or withdraw the claim.'],
]

const reviewers = [
  ['Reviewer #1 — novelty and claims', ['Major: the stated contribution overlaps prior work unless you isolate the new component.', 'Minor: the abstract claims generality the experiments do not cover.', 'Question: which result would falsify your hypothesis?', 'Required: an ablation separating the new component from tuning.']],
  ['Reviewer #2 — methodology and statistics', ['Major: single-seed results cannot support the reported margin.', 'Minor: no confidence intervals or variance across runs.', 'Question: is the baseline tuned with the same budget?', 'Required: at least three seeds and reported variance.']],
  ['Reviewer #3 — clarity and reproducibility', ['Major: the method section is not implementable as written.', 'Minor: dataset splits and preprocessing are unspecified.', 'Question: what hardware and wall-clock time does this need?', 'Required: environment specification and seeds in the appendix.']],
]

const repro = ['Code availability', 'Dataset availability', 'Environment reproducibility', 'Experiment documentation', 'Random seeds', 'Baseline implementation', 'Evaluation completeness']

export default function Research({ experiments, addExperiment, ideas, addIdea }: Props) {
  const [tab, setTab] = useState<'lab' | 'experiments' | 'benchmark' | 'ideas' | 'review'>('lab')
  const [exp, setExp] = useState({ title: '', model: '', dataset: '', config: '', metric: '', result: '', conclusion: '', status: 'running' })
  const [idea, setIdea] = useState({ title: '', problem: '', approach: '', difficulty: 'Intermediate', status: 'idea' })
  const [a, setA] = useState(''); const [b, setB] = useState('')
  const [checks, setChecks] = useState<string[]>([])

  const expA = experiments.find(e => e.id === a); const expB = experiments.find(e => e.id === b)
  const score = Math.round((checks.length / repro.length) * 100)

  return (
    <div className="view">
      <ViewHead icon={<FlaskConical />} title="Research & Model Lab" text="A supervisor, not a cheerleader: weak assumptions get challenged before results get believed." />
      <div className="tabs">
        {([['lab', 'Research Lab'], ['experiments', 'Experiment tracker'], ['benchmark', 'Benchmark Arena'], ['ideas', 'Idea vault'], ['review', 'Peer review']] as const)
          .map(([k, l]) => <button key={k} className={tab === k ? 'tab active' : 'tab'} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      {tab === 'lab' && <>
        <Panel label="WORKFLOW" title="Original research, in order">
          {workflow.map((w, i) => <div className="row" key={w[0]}><span className="index">{String(i + 1).padStart(2, '0')}</span><div><b>{w[0]}</b><p>{w[1]}</p></div></div>)}
        </Panel>
        <Panel label="RESEARCH QUESTION GENERATOR" title="Derived from stated paper limitations">
          {papers.slice(0, 5).map(p => (
            <div className="lesson" key={p.id}>
              <div className="lessonhead"><div><b>{p.title}</b><p>{p.limitations}</p></div><Tag tone="warn">{p.difficulty}</Tag></div>
              <ul>{p.opportunities.map(o => <li key={o}>{o}</li>)}</ul>
            </div>
          ))}
          <Evidence>Every question above traces to a limitation stated in the paper itself. No invented trends.</Evidence>
        </Panel>
        <Panel label="REPRODUCIBILITY SCORE" title={`${score}% on this project`}>
          {repro.map(r => (
            <label className="check" key={r}>
              <input type="checkbox" checked={checks.includes(r)} onChange={e => setChecks(v => e.target.checked ? [...v, r] : v.filter(x => x !== r))} />
              {r}
            </label>
          ))}
        </Panel>
      </>}

      {tab === 'experiments' && <>
        <Panel label="NEW RUN" title="Log an experiment">
          <div className="formgrid">
            {(['title', 'model', 'dataset', 'config', 'metric', 'result', 'conclusion'] as const).map(k => (
              <label key={k} className="field">{k}
                <input value={(exp as any)[k]} onChange={e => setExp({ ...exp, [k]: e.target.value })} placeholder={k === 'config' ? 'lr=3e-4, bs=64, seed=0' : ''} />
              </label>
            ))}
            <label className="field">status
              <select value={exp.status} onChange={e => setExp({ ...exp, status: e.target.value })}>
                {['planned', 'running', 'complete', 'failed'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <button className="primary" disabled={!exp.title.trim()} onClick={() => { addExperiment(exp); setExp({ title: '', model: '', dataset: '', config: '', metric: '', result: '', conclusion: '', status: 'running' }) }}>Record run</button>
        </Panel>
        <Panel label="RECORD" title={`${experiments.length} experiments`}>
          {experiments.length === 0 && <p className="empty">No runs yet. An unlogged experiment did not happen.</p>}
          {experiments.map(e => (
            <div className="lesson" key={e.id}>
              <div className="lessonhead">
                <div><b>{e.title}</b><p>{e.model || '—'} · {e.dataset || '—'} · {e.config || 'no config recorded'}</p></div>
                <div className="lessonmeta"><Tag tone={e.status === 'complete' ? 'ok' : e.status === 'failed' ? 'warn' : 'info'}>{e.status}</Tag></div>
              </div>
              <div className="task"><b>{e.metric || 'METRIC'}</b><span>{e.result || 'no result recorded'}</span></div>
              {e.conclusion && <div className="task"><b>CONCLUSION</b><span>{e.conclusion}</span></div>}
            </div>
          ))}
        </Panel>
      </>}

      {tab === 'benchmark' && <Panel label="BENCHMARK ARENA" title="A vs B, with the tradeoff stated">
        <div className="rowtags">
          <select value={a} onChange={e => setA(e.target.value)}><option value="">Experiment A</option>{experiments.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}</select>
          <select value={b} onChange={e => setB(e.target.value)}><option value="">Experiment B</option>{experiments.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}</select>
        </div>
        {expA && expB ? <>
          <table className="dtable">
            <thead><tr><th>Field</th><th>{expA.title}</th><th>{expB.title}</th></tr></thead>
            <tbody>
              {(['model', 'dataset', 'config', 'metric', 'result', 'conclusion', 'status'] as const).map(k => (
                <tr key={k}><td>{k}</td><td>{expA[k] || '—'}</td><td>{expB[k] || '—'}</td></tr>
              ))}
            </tbody>
          </table>
          <Evidence>Difference analysis is only valid if both runs share the metric, dataset and tuning budget. Otherwise this is not a comparison.</Evidence>
        </> : <p className="empty">Select two recorded runs. Accuracy, latency, memory, throughput and cost move against each other — never optimise one alone.</p>}
      </Panel>}

      {tab === 'ideas' && <>
        <Panel label="IDEA VAULT" title="Research and engineering ideas">
          <div className="formgrid">
            <label className="field">title<input value={idea.title} onChange={e => setIdea({ ...idea, title: e.target.value })} /></label>
            <label className="field">difficulty
              <select value={idea.difficulty} onChange={e => setIdea({ ...idea, difficulty: e.target.value })}>
                {['Beginner', 'Intermediate', 'Advanced', 'Publication-level'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
          </div>
          <label className="field">problem<textarea rows={3} value={idea.problem} onChange={e => setIdea({ ...idea, problem: e.target.value })} /></label>
          <label className="field">approach<textarea rows={3} value={idea.approach} onChange={e => setIdea({ ...idea, approach: e.target.value })} /></label>
          <button className="primary" disabled={!idea.title.trim()} onClick={() => { addIdea(idea); setIdea({ title: '', problem: '', approach: '', difficulty: 'Intermediate', status: 'idea' }) }}>Save idea</button>
          <p className="fineprint">Ideas are stored, not praised. Novelty requires a literature check.</p>
        </Panel>
        <Panel label="VAULT" title={`${ideas.length} entries`}>
          {ideas.length === 0 && <p className="empty">Empty.</p>}
          {ideas.map(i => (
            <div className="lesson" key={i.id}>
              <div className="lessonhead"><div><b>{i.title}</b><p>{i.problem}</p></div><div className="lessonmeta"><Tag tone="warn">{i.difficulty}</Tag></div></div>
              {i.approach && <div className="task"><b>APPROACH</b><span>{i.approach}</span></div>}
            </div>
          ))}
        </Panel>
      </>}

      {tab === 'review' && <Panel label="PEER REVIEW SIMULATOR" title="Three hostile reviewers">
        {reviewers.map(([name, items]) => (
          <div className="lesson" key={name as string}>
            <div className="lessonhead"><div><b>{name}</b></div></div>
            <ul>{(items as string[]).map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        ))}
        <Evidence>No review here concludes &ldquo;publishable&rdquo;. That judgement requires a venue, not an app.</Evidence>
      </Panel>}
    </div>
  )
}
