import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://pohyykxhsdcctsamxqbl.supabase.co";

const SUPABASE_ANON_KEY = "TA_CLE_ANON";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
