import type { ReactNode } from 'react'

export function ViewHead({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="viewhead"><div className="viewicon">{icon}</div><div><small>CS RESEARCH UNIVERSITY</small><h2>{title}</h2><p>{text}</p></div></div>
}

export function Panel({ label, title, action, children }: { label: string; title: string; action?: ReactNode; children: ReactNode }) {
  return <section className="panel"><div className="panelhead"><div><small>{label}</small><h3>{title}</h3></div>{action}</div>{children}</section>
}

export function SeedBadge({ note = 'Seeded demonstration data — not a live feed' }: { note?: string }) {
  return <span className="seed" title={note}>SEEDED</span>
}

export function Tag({ children, tone }: { children: ReactNode; tone?: 'ok' | 'warn' | 'info' }) {
  return <span className={tone ? `tag ${tone}` : 'tag'}>{children}</span>
}

export function Source({ label, url }: { label: string; url: string }) {
  return <a className="source-link" href={url} target="_blank" rel="noreferrer noopener">{label} ↗</a>
}

export function Bar({ value }: { value: number }) {
  return <div className="progress"><i style={{ width: `${Math.round(value * 100)}%` }} /></div>
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}

export function Evidence({ children }: { children: ReactNode }) {
  return <div className="evidence"><b>Evidence</b><span>{children}</span></div>
}
