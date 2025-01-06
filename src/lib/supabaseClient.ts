import { createClient } from '@supabase/supabase-js';
import { useAuth } from "@clerk/nextjs"; // For client-side authentication


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* 
// Supabase client with Clerk JWT token (for authenticated requests)
export const useSupabaseClient = () => {
    const { getToken } = useAuth();

    // Get the Clerk JWT token for Supabase
    const getSupabaseToken = async () => {
        const token = await getToken({ template: "supabase" });
        return token;
    };

    // Create a Supabase client with the Clerk JWT token
    const createSupabaseClient = async () => {
        const token = await getSupabaseToken();
        return createClient(supabaseUrl, supabaseAnonKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        });
    };

    return createSupabaseClient();
};

 */