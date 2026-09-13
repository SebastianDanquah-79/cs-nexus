import { createClient } from '@supabase/supabase-js'

// Vite builds use VITE_* variables. NEXT_PUBLIC_* is also accepted so the
// same Supabase configuration can be reused when deploying through Vercel.
const url = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null
export const supabaseConfigured = Boolean(supabase)
