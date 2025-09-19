// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fomwkpkkmbffarpehprb.supabase.co"; // your Supabase project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXdrcGtrbWJmZmFycGVocHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDAxMDAsImV4cCI6MjA3MzY3NjEwMH0.V_Uze7QRG-GfP3wB987WqUrF4IHcJ0Sfh1zrRcKZUe4";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Handle refresh token errors gracefully
    flowType: 'pkce'
  },
  // Add global error handling
  global: {
    headers: {
      'X-Client-Info': 'pm-internmatch-web'
    }
  }
});