import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rragworvrbrekpzumrqk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyYWd3b3J2cmJyZWtwenVtcnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MTM1OTUsImV4cCI6MjA2NjA4OTU5NX0.7BQnswDEeABtsDnZ08Qy2K_cM6dLKmw2kgJ8aUV68ug';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);