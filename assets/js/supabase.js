import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://pohyykxhsdcctsamxqbl.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_2IY1P0xITKdQmZ03qt4arg_Tp8Ps-vW";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
