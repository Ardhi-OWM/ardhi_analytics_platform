import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { user_id, input_type, data_link } = await req.json();

        // Validate required fields
        if (!user_id || !input_type || !data_link) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("Received payload:", { user_id, input_type, data_link });

        // Insert input data
        const { data: inputData, error: inputError } = await supabase
            .from('inputs')
            .insert({ user_id, input_type, data_link });

        if (inputError) {
            console.error("Error inserting data into inputs table:", inputError);
            return NextResponse.json({ error: "Failed to insert input data", details: inputError }, { status: 500 });
        }

        console.log("Insert successful:", inputData);

        return NextResponse.json({ message: "Service added successfully", data: inputData }, { status: 200 });
    } catch (err) {
        console.error("Unexpected server error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
