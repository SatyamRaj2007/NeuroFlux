import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qhrdfvvxxrccdckaypse.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocmRmdnZ4eHJjY2Rja2F5cHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjY3MjcsImV4cCI6MjA5MTA0MjcyN30.m4Hywk6pYEqywHF4gYEX9TyyfFL8awWE4JQuiOI7hMo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
