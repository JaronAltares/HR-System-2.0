import { createClient } from '@supabase/supabase-js'

// FIXED: Utilizing Vite dynamic environment runtime variables to avoid repository history leaks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase client initialized successfully with Hope HR System project')