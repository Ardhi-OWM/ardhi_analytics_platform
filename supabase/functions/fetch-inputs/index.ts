import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  try {
    const user_id = req.headers.get("user_id");

    if (!user_id) {
      return new Response(JSON.stringify({ error: "Missing user ID" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("inputs")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
});
