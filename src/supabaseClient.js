/**
 * Supabase Client Configuration
 *
 * This client is used to interact with the Supabase database for gameweek filtering.
 * Uses the anonymous key which only has read access (protected by RLS policies).
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Make sure you have set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env.local file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false // We don't need auth sessions for this read-only access
  }
});

// Helper function to check Supabase connection
export async function testSupabaseConnection() {
  try {
    const { error } = await supabase
      .from('seasons')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}
