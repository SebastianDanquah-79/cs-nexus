import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

export type TableName =
  | 'mastery' | 'mistakes' | 'notes' | 'university_courses'
  | 'paper_progress' | 'experiments' | 'ideas' | 'attempts' | 'profiles'

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true) })
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])
  return { user, ready }
}

/** Reads every row of a per-user table and gives back typed-enough CRUD helpers. */
export function useRows<T extends Record<string, any>>(table: TableName, userId?: string) {
  const [rows, setRows] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!userId) { setRows([]); setLoading(false); return }
    const { data } = await (supabase.from(table) as any).select('*').eq('user_id', userId)
    setRows((data ?? []) as T[])
    setLoading(false)
  }, [table, userId])

  useEffect(() => { void load() }, [load])

  const insert = useCallback(async (row: Record<string, any>) => {
    if (!userId) return
    await (supabase.from(table) as any).insert({ ...row, user_id: userId })
    await load()
  }, [table, userId, load])

  const update = useCallback(async (id: string, patch: Record<string, any>) => {
    await (supabase.from(table) as any).update(patch).eq('id', id)
    await load()
  }, [table, load])

  const remove = useCallback(async (id: string) => {
    await (supabase.from(table) as any).delete().eq('id', id)
    await load()
  }, [table, load])

  return { rows, loading, reload: load, insert, update, remove }
}

export const masteryLevels = ['unseen', 'learned', 'implemented', 'explained', 'mastered', 'applied'] as const
export type MasteryLevel = typeof masteryLevels[number]
export const nextLevel = (l: string): MasteryLevel => {
  const i = masteryLevels.indexOf(l as MasteryLevel)
  return masteryLevels[Math.min(i < 0 ? 1 : i + 1, masteryLevels.length - 1)]
}
export const masteryScore = (l: string) => Math.max(0, masteryLevels.indexOf(l as MasteryLevel)) / (masteryLevels.length - 1)

export type MasteryRow = { id: string; lesson_id: string; course_id: string; level: string; updated_at: string }
export type MistakeRow = { id: string; topic: string; cause: string; detail: string; resolved: boolean; created_at: string }
export type NoteRow = { id: string; kind: string; ref_id: string | null; title: string; body: string; created_at: string }
export type UniCourseRow = { id: string; code: string; title: string; credits: number; grade_points: number | null; target_points: number | null; semester: string }
export type PaperProgressRow = { id: string; paper_id: string; stage: string; read_done: boolean; reproduction_status: string; explanation: string }
export type ExperimentRow = { id: string; title: string; model: string; dataset: string; config: string; metric: string; result: string; conclusion: string; status: string; created_at: string }
export type IdeaRow = { id: string; title: string; problem: string; approach: string; difficulty: string; status: string; created_at: string }
export type AttemptRow = { id: string; problem_id: string; mode: string; answer: string; self_score: number | null; minutes: number | null; created_at: string }

export const causes = [
  'Misunderstood concept', 'Forgot a fact', 'Wrong algorithm', 'Mathematical error',
  'Misread the question', 'Coding mistake', 'Reasoning mistake', 'Ran out of time',
]
