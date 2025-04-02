import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ppumhzqyzzugdphwqtnh.supabase.co";

let supaKey = import.meta.env.VITE_SUPA_KEY;
const supabase = createClient(supabaseUrl, supaKey);

export { supabase };
