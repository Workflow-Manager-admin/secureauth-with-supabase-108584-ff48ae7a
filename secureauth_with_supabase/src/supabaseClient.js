/**
 * supabaseClient.js
 * Sets up and exports the singleton Supabase client, reading keys from .env file.
 * Make sure:
 *   - REACT_APP_SUPABASE_URL
 *   - REACT_APP_SUPABASE_ANON_KEY
 * are present in your .env, as required for client-side projects.
 */
import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);
