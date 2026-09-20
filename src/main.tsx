import { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BarChart3, BookOpen, BrainCircuit, Code2, FlaskConical, Gauge, GraduationCap,
  LayoutDashboard, LogOut, Menu, Newspaper, Radar, Search, Terminal, X, AlertTriangle,
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import {
  useAuthUser, useRows, nextLevel,
  type AttemptRow, type ExperimentRow, type IdeaRow, type MasteryRow, type MistakeRow,
  type NoteRow, type PaperProgressRow, type UniCourseRow,
} from '@/lib/store'
import Dashboard from '@/pages/Dashboard'
import Curriculum from '@/pages/Curriculum'
import Practice from '@/pages/Practice'
import Papers from '@/pages/Papers'
import Research from '@/pages/Research'
import Intelligence from '@/pages/Intelligence'
import GPA from '@/pages/GPA'
import Mistakes from '@/pages/Mistakes'
import Portfolio from '@/pages/Portfolio'
import Reports from '@/pages/Reports'
import './styles.css'

const sections = [
  { group: 'Daily', items: [{ name: 'Dashboard', icon: LayoutDashboard }] },
  { group: 'Education', items: [{ name: 'Curriculum', icon: GraduationCap }, { name: 'Practice & Exams', icon: Terminal }] },
  { group: 'Research', items: [{ name: 'Research Observatory', icon: BookOpen }, { name: 'Research Lab', icon: FlaskConical }] },
  { group: 'Intelligence', items: [{ name: 'AI Intelligence', icon: Newspaper }, { name: 'Technology Radar', icon: Radar }, { name: 'Open Source Radar', icon: BookOpen }] },
  { group: 'Record', items: [{ name: 'Mistakes & Review', icon: AlertTriangle }, { name: 'GPA Engine', icon: Gauge }, { name: 'Reports & Analytics', icon: BarChart3 }, { name: 'Portfolio', icon: Code2 }] },
]
const allPages = sections.flatMap(s => s.items.map(i => i.name))

const commands: [string, string][] = [
  ["Start today's study plan", 'Dashboard'],
  ['Give me a hard algorithms problem', 'Practice & Exams'],
  ['Start an interleaved exam', 'Practice & Exams'],
  ['Explain transformers', 'Research Observatory'],
  ['Read a paper with me', 'Research Observatory'],
  ['Find my weakest concepts', 'Mistakes & Review'],
  ["Show today's AI news", 'AI Intelligence'],
  ['Check the technology radar', 'Technology Radar'],
  ['Find a project to contribute to', 'Open Source Radar'],
  ['Review my mistakes', 'Mistakes & Review'],
  ['Show my GPA', 'GPA Engine'],
  ['Open my research ideas', 'Research Lab'],
  ['Open my portfolio', 'Portfolio'],
  ['Show my long-term report', 'Reports & Analytics'],
]

function AuthGate() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setError('')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { display_name: name }, emailRedirectTo: window.location.origin } })
    setBusy(false)
    if (result.error) setError(result.error.message)
    else if (mode === 'signup' && !result.data.session) setError('Account created. Confirm your email, then sign in.')
  }

  return (
    <div className="authscreen">
      <form className="authcard" onSubmit={submit}>
        <div className="mark">CS</div>
        <h1>CS Research University</h1>
        <p>{mode === 'login' ? 'Sign in to your computational institution.' : 'Create your permanent academic record.'}</p>
        {mode === 'signup' && <input required value={name} onChange={e => setName(e.target.value)} placeholder="Display name" />}
        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input required minLength={6} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        {error && <div className="notice">{error}</div>}
        <button className="primary full" disabled={busy}>{busy ? 'Working…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <button type="button" className="linkbutton" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
          {mode === 'login' ? 'Create an account' : 'Back to sign in'}
        </button>
      </form>
    </div>
  )
}

function Workspace({ userId, name }: { userId: string; name: string }) {
  const [active, setActive] = useState('Dashboard')
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [palette, setPalette] = useState(false)
  const [cmd, setCmd] = useState('')

  const mastery = useRows<MasteryRow>('mastery', userId)
  const mistakes = useRows<MistakeRow>('mistakes', userId)
  const attempts = useRows<AttemptRow>('attempts', userId)
  const uni = useRows<UniCourseRow>('university_courses', userId)
  const paperProgress = useRows<PaperProgressRow>('paper_progress', userId)
  const experiments = useRows<ExperimentRow>('experiments', userId)
  const ideas = useRows<IdeaRow>('ideas', userId)
  useRows<NoteRow>('notes', userId)

  const nav = useCallback((page: string) => {
    if (!allPages.includes(page)) return
    setActive(page); setOpen(false); setPalette(false)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette(v => !v); setCmd('') }
      if (e.key === 'Escape') setPalette(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const setLevel = useCallback(async (courseId: string, lessonId: string, level: string) => {
    const row = mastery.rows.find(m => m.lesson_id === lessonId)
    if (row) await mastery.update(row.id, { level, updated_at: new Date().toISOString() })
    else await mastery.insert({ lesson_id: lessonId, course_id: courseId, level: level || nextLevel('unseen') })
  }, [mastery])

  const savePaper = useCallback(async (paperId: string, patch: Record<string, any>) => {
    const row = paperProgress.rows.find(p => p.paper_id === paperId)
    if (row) await paperProgress.update(row.id, patch)
    else await paperProgress.insert({ paper_id: paperId, stage: 'Abstract', read_done: false, reproduction_status: 'not started', explanation: '', ...patch })
  }, [paperProgress])

  const matches = useMemo(() => {
    const q = cmd.trim().toLowerCase()
    return q ? commands.filter(([label]) => label.toLowerCase().includes(q)) : commands
  }, [cmd])

  const render = () => {
    switch (active) {
      case 'Dashboard': return <Dashboard name={name} mastery={mastery.rows} mistakes={mistakes.rows} nav={nav} />
      case 'Curriculum': return <Curriculum mastery={mastery.rows} setLevel={setLevel} query={query} />
      case 'Practice & Exams': return (
        <Practice
          attempts={attempts.rows}
          saveAttempt={row => void attempts.insert(row)}
          logMistake={row => void mistakes.insert({ ...row, resolved: false })}
        />
      )
      case 'Research Observatory': return <Papers progress={paperProgress.rows} save={savePaper} query={query} />
      case 'Research Lab': return (
        <Research
          experiments={experiments.rows}
          addExperiment={row => void experiments.insert(row)}
          ideas={ideas.rows}
          addIdea={row => void ideas.insert(row)}
        />
      )
      case 'GPA Engine': return <GPA rows={uni.rows} add={row => void uni.insert(row)} update={(id, p) => void uni.update(id, p)} remove={id => void uni.remove(id)} />
      case 'Mistakes & Review': return <Mistakes mistakes={mistakes.rows} mastery={mastery.rows} add={row => void mistakes.insert({ resolved: false, ...row })} update={(id, p) => void mistakes.update(id, p)} />
      case 'Portfolio': return <Portfolio name={name} mastery={mastery.rows} attempts={attempts.rows} experiments={experiments.rows} ideas={ideas.rows} paperProgress={paperProgress.rows} />
      case 'Reports & Analytics': return <Reports mastery={mastery.rows} mistakes={mistakes.rows} attempts={attempts.rows} experiments={experiments.rows} paperProgress={paperProgress.rows} uni={uni.rows} />
      default: return <Intelligence page={active} query={query} />
    }
  }

  return (
    <div className="app">
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand">
          <div className="mark">CS</div>
          <div><b>CS Research University</b><span>Institute of Computation</span></div>
          <button className="close" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <nav>
          {sections.map(s => (
            <div className="navgroup" key={s.group}>
              <label>{s.group}</label>
              {s.items.map(({ name: n, icon: Icon }) => (
                <button key={n} className={active === n ? 'navitem active' : 'navitem'} onClick={() => nav(n)}><Icon size={16} />{n}</button>
              ))}
            </div>
          ))}
          <div className="navgroup">
            <label>Session</label>
            <button className="navitem" onClick={() => void supabase.auth.signOut()}><LogOut size={16} />Sign out</button>
          </div>
        </nav>
      </aside>
      <main>
        <header>
          <button className="mobile" onClick={() => setOpen(true)}><Menu size={18} /></button>
          <div><small>CS RESEARCH UNIVERSITY</small><h1>{active}</h1></div>
          <div className="headerActions">
            <button className="search" onClick={() => { setPalette(true); setCmd('') }}><BrainCircuit size={15} />Command palette<kbd>⌘K</kbd></button>
            <div className="search"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Filter lessons, papers, news" /></div>
            <div className="avatar">{name.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>
        <section className="content">{render()}</section>
      </main>
      {palette && (
        <div className="paletteback" onClick={() => setPalette(false)}>
          <div className="palette" onClick={e => e.stopPropagation()}>
            <input autoFocus value={cmd} onChange={e => setCmd(e.target.value)} placeholder="Type a command…" />
            <div className="palettelist">
              {matches.map(([label, page]) => (
                <button key={label} onClick={() => nav(page)}><span>{label}</span><em>{page}</em></button>
              ))}
              {!matches.length && <p className="empty">No command matches that.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  const { user, ready } = useAuthUser()
  if (!ready) return <div className="authscreen"><div className="authcard"><div className="mark">CS</div><p>Loading your record…</p></div></div>
  if (!user) return <AuthGate />
  const name = (user.user_metadata?.display_name as string) || user.email || 'Student'
  return <Workspace userId={user.id} name={name} />
}

createRoot(document.getElementById('root')!).render(<App />)
