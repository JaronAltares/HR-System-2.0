import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lcruwvfrwqmwbvmuzgtc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjcnV3dmZyd3Ftd2J2bXV6Z3RjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzM0OTYsImV4cCI6MjA5NDI0OTQ5Nn0.9hCPzSnH0caugkXUJPYR304OAck1ZKxuvqyyD3yLMGE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase client initialized successfully with Hope HR System project')
