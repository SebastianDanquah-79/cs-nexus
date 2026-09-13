import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrainCircuit, BookOpen, FlaskConical, Gauge, GraduationCap,
  LayoutDashboard, Menu, Newspaper, Radar, Search, Sigma, Terminal, X,
  CheckCircle2, Play, Plus, ArrowRight, BarChart3, Cpu, Code2, Bot
} from 'lucide-react'
import './styles.css'

type Section = { group: string; items: { name: string; icon: typeof LayoutDashboard }[] }

const sections: Section[] = [
  { group: 'Daily', items: [{ name: 'Dashboard', icon: LayoutDashboard }, { name: 'AI Faculty', icon: BrainCircuit }] },
  { group: 'Education', items: [{ name: 'Curriculum', icon: GraduationCap }, { name: 'Practice & Exams', icon: Terminal }, { name: 'Mathematics & Proof', icon: Sigma }] },
  { group: 'Research', items: [{ name: 'Research Observatory', icon: BookOpen }, { name: 'Research & Model Lab', icon: FlaskConical }, { name: 'Knowledge Graph', icon: Radar }] },
  { group: 'Intelligence', items: [{ name: 'AI Intelligence', icon: Newspaper }, { name: 'Technology Radar', icon: Radar }, { name: 'Open Source Radar', icon: BookOpen }] },
  { group: 'Record', items: [{ name: 'GPA Engine', icon: Gauge }, { name: 'Reports & Analytics', icon: BarChart3 }, { name: 'Portfolio', icon: Code2 }] },
]

const courses = [
  ['Algorithms & Data Structures', 'Graphs, heaps, amortized analysis', 72],
  ['Probability for ML', 'Random variables, distributions, Bayes', 61],
  ['Computer Architecture', 'ISA, caches, pipelines, memory', 38],
  ['PyTorch Foundations', 'Tensors, autograd, training loops', 24],
]

function App() {
  const [active, setActive] = useState('Dashboard')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [completed, setCompleted] = useState<string[]>([])
  const [session, setSession] = useState(false)

  const nav = (name: string) => { setActive(name); setOpen(false) }
  const filtered = useMemo(() => courses.filter(c => c[0].toLowerCase().includes(query.toLowerCase())), [query])
  const toggleCourse = (name: string) => setCompleted(v => v.includes(name) ? v.filter(x => x !== name) : [...v, name])

  const renderView = () => {
    if (active === 'Dashboard') return <Dashboard nav={nav} completed={completed} toggleCourse={toggleCourse} />
    if (active === 'Curriculum') return <Curriculum completed={completed} toggleCourse={toggleCourse} filtered={filtered} />
    if (active === 'Practice & Exams') return <Practice session={session} setSession={setSession} />
    if (active === 'GPA Engine') return <GPA />
    if (active === 'Portfolio') return <Portfolio />
    if (active === 'AI Faculty') return <Faculty />
    return <Module title={active} />
  }

  return <div className="app">
    <aside className={open ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><div className="mark">CS</div><div><b>CS Nexus</b><span>Institute of Computation</span></div><button className="close" onClick={() => setOpen(false)}><X size={18}/></button></div>
      <nav>{sections.map(s => <div className="navgroup" key={s.group}><label>{s.group}</label>{s.items.map(({name: n, icon: Icon}) => <button key={n} className={active === n ? 'navitem active' : 'navitem'} onClick={() => nav(n)}><Icon size={16}/>{n}</button>)}</div>)}</nav>
    </aside>
    <main>
      <header><button className="mobile" onClick={() => setOpen(true)}><Menu size={18}/></button><div><small>CS NEXUS / WORKSPACE</small><h1>{active}</h1></div><div className="headerActions"><div className="search"><Search size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search courses"/><kbd>⌘K</kbd></div><div className="avatar">SD</div></div></header>
      <section className="content">{renderView()}</section>
    </main>
  </div>
}

function Dashboard({nav, completed, toggleCourse}: {nav:(s:string)=>void; completed:string[]; toggleCourse:(s:string)=>void}) {
  return <>
    <div className="hero"><div><small>COMPUTATION LAB</small><h2>Build. Study. Research.</h2><p>Your operating system for serious computer science work.</p></div><button className="primary" onClick={() => nav('Curriculum')}>Continue curriculum <ArrowRight size={15}/></button></div>
    <div className="metrics">{[['Current GPA','3.82 / 4.00','+0.14 this term'],['Courses','6 active','18 credits'],['Research','3 active','1 experiment running'],['Streak','12 days','Best: 18 days']].map(c => <div className="metric" key={c[0]}><span>{c[0]}</span><strong>{c[1]}</strong><em>{c[2]}</em></div>)}</div>
    <div className="grid"><section className="panel"><div className="panelhead"><div><small>THIS WEEK</small><h3>Learning plan</h3></div><button onClick={() => nav('Curriculum')}>Open curriculum →</button></div>{courses.map((c,i) => <CourseRow key={c[0]} course={c} index={i} done={completed.includes(c[0])} toggle={toggleCourse}/>)}</section><Research nav={nav}/></div>
    <div className="bottom"><section className="panel"><div className="panelhead"><div><small>INTELLIGENCE FEED</small><h3>What matters now</h3></div><button onClick={() => nav('AI Intelligence')}>View all →</button></div><article><span className="source">RESEARCH</span><b>Reasoning models are changing how agents plan</b><p>Read, annotate and reproduce papers as engineering inputs.</p></article><article><span className="source">OPEN SOURCE</span><b>New inference tooling cuts local model latency</b><p>Compare benchmarks before adopting a stack.</p></article></section><section className="panel quick"><small>COMMAND CENTER</small><h3>Next action</h3><p>Complete the next curriculum checkpoint, then log one research experiment.</p><button className="primary full" onClick={() => nav('Practice & Exams')}>Start 45-minute session <Play size={14}/></button></section></div>
  </>
}

function CourseRow({course, index, done, toggle}: {course:(string|number)[]; index:number; done:boolean; toggle:(s:string)=>void}) {
  const name = String(course[0]); return <button className="row rowbutton" onClick={() => toggle(name)}><span className="index">0{index+1}</span><div><b>{name}</b><p>{course[1]}</p></div><span className="tag">{done ? 'DONE' : `${course[2]}%`}</span>{done && <CheckCircle2 size={16}/>}</button>
}

function Research({nav}:{nav:(s:string)=>void}) { return <section className="panel"><div className="panelhead"><div><small>RESEARCH DESK</small><h3>Active work</h3></div><button onClick={() => nav('Research & Model Lab')}>Lab →</button></div>{[['Transformer ablation study','12 experiments queued · last run 4m ago'],['Small language model','Architecture notes · 7 citations'],['Edge vision benchmark','3 models · Raspberry Pi target']].map((r,i)=><div className="research" key={r[0]}><div className={i ? 'pulse dim' : 'pulse'}></div><div><b>{r[0]}</b><p>{r[1]}</p></div></div>)}</section> }

function Curriculum({completed,toggleCourse,filtered}:{completed:string[];toggleCourse:(s:string)=>void;filtered:(string|number)[][]}) { return <div className="view"><ViewHead icon={<GraduationCap/>} title="Curriculum" text="Track the core CS, AI and systems sequence."/><div className="coursegrid">{filtered.map((c,i)=><div className="coursecard" key={c[0]}><span>MODULE 0{i+1}</span><h3>{c[0]}</h3><p>{c[1]}</p><div className="progress"><i style={{width:`${c[2]}%`}}/></div><footer><b>{c[2]}%</b><button onClick={() => toggleCourse(String(c[0]))}>{completed.includes(String(c[0])) ? 'Completed' : 'Mark complete'}</button></footer></div>)}</div></div> }

function Practice({session,setSession}:{session:boolean;setSession:(v:boolean)=>void}) { return <div className="view"><ViewHead icon={<Terminal/>} title="Practice & Exams" text="Use timed sessions to turn knowledge into working skill."/><div className="actioncard"><Terminal/><h3>45-minute algorithms session</h3><p>Three problems covering graphs, heaps and complexity analysis.</p><button className="primary" onClick={() => setSession(!session)}>{session ? 'Session active' : 'Start session'} <Play size={14}/></button>{session && <div className="notice"><CheckCircle2 size={16}/> Timer started. Focus mode is active.</div>}</div></div> }

function GPA() { const [g,setG]=useState([['Algorithms',4],['AI',3.7],['Math',3.3],['Architecture',4]]); const avg=(g.reduce((a,x)=>a+Number(x[1]),0)/g.length).toFixed(2); return <div className="view"><ViewHead icon={<Gauge/>} title="GPA Engine" text="A simple local GPA calculator for your current courses."/><div className="gpa"><div className="gpanumber">{avg}<small>/ 4.00</small></div>{g.map((x,i)=><label key={x[0] as string}>{x[0]}<select value={x[1]} onChange={e=>setG(v=>v.map((r,j)=>j===i?[r[0],Number(e.target.value)]:r))}><option value="4">A · 4.0</option><option value="3.7">A- · 3.7</option><option value="3.3">B+ · 3.3</option><option value="3">B · 3.0</option><option value="2.7">B- · 2.7</option></select></label>)}</div></div> }

function Portfolio() { return <div className="view"><ViewHead icon={<Code2/>} title="Portfolio" text="A living record of projects, research and technical work."/><div className="coursegrid"><div className="coursecard"><Cpu/><span>HARDWARE</span><h3>Adaptive Traffic Controller</h3><p>Verilog FSM, sensor input and emergency override.</p><button className="secondary"><Plus size={14}/> Add evidence</button></div><div className="coursecard"><Bot/><span>AI</span><h3>AI Research Lab</h3><p>Experiments, model evaluations and reproducible notes.</p><button className="secondary"><Plus size={14}/> Add project</button></div></div></div> }

function Faculty() { const [q,setQ]=useState(''); const [answer,setAnswer]=useState(''); return <div className="view"><ViewHead icon={<BrainCircuit/>} title="AI Faculty" text="Ask for an explanation, study plan or debugging direction."/><div className="faculty"><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask: explain gradient descent like I am building it from scratch..."/><button className="primary" onClick={() => setAnswer(q ? `Study guidance for: ${q}` : 'Enter a question first.')}>Ask Faculty</button>{answer && <div className="notice"><BrainCircuit size={16}/>{answer}</div>}</div></div> }

function Module({title}:{title:string}) { return <div className="view"><ViewHead icon={<Radar/>} title={title} text="This module is ready as the next CS Nexus workspace surface."/><div className="modulegrid"><div><small>STATUS</small><h3>Workspace ready</h3><p>The navigation now loads a real view instead of leaving the dashboard unchanged.</p></div><div><small>NEXT</small><h3>Connect data</h3><p>Supabase, research feeds and authentication can be connected without changing the core interface.</p></div></div></div> }

function ViewHead({icon,title,text}:{icon:React.ReactNode;title:string;text:string}) { return <div className="viewhead"><div className="viewicon">{icon}</div><div><small>CS NEXUS</small><h2>{title}</h2><p>{text}</p></div></div> }

createRoot(document.getElementById('root')!).render(<App />)
