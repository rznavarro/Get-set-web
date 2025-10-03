import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://burfhxdwlvhlbfnltjfk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1cmZoeGR3bHZobGJmbmx0amZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NzkwMTgsImV4cCI6MjA3NTA1NTAxOH0.EyM2GVZQEi_bwVbrF5uAhu4-IqJoNMHfY_xEK6PQwOk'

export const supabase = createClient(supabaseUrl, supabaseKey)