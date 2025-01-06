import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const useSupabaseClient = () => {
    const { getToken } = useAuth();  // Hook at the top level

    const getSupabaseToken = async () => {
        const token = await getToken({ template: "supabase" });
        if (!token) throw new Error("Token not available.");
        await supabaseClient.auth.setSession({ access_token: token, refresh_token: "" });
        return token;
    };

    return { supabaseClient, getSupabaseToken };
};
