import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { WebhookEvent } from '@clerk/nextjs/server';

//  Improved environment variable handling with fallback error
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

//  Validate environment variables at runtime
if (!supabaseUrl || !supabaseKey || !WEBHOOK_SECRET) {
    throw new Error('Required environment variables are missing. Check your .env file.');
}

//  Initialize Supabase client only if keys are available
const supabase = createClient(supabaseUrl, supabaseKey);

// Type guard to check if the event is a user event
function isUserEvent(event: WebhookEvent): event is WebhookEvent & { data: { email_addresses: { email_address: string }[] } } {
    return 'email_addresses' in event.data;
}


export async function POST(req: NextRequest) {
    try {
        //  Double-check WEBHOOK_SECRET is set at runtime
        if (!WEBHOOK_SECRET) {
            return NextResponse.json({ error: 'Missing Clerk webhook secret' }, { status: 500 });
        }

        //  Await headers properly (ensure correct method)
        const headerPayload = await headers();
        const svix_id = headerPayload.get('svix-id');
        const svix_timestamp = headerPayload.get('svix-timestamp');
        const svix_signature = headerPayload.get('svix-signature');

        //  Validate Svix headers
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return NextResponse.json({ error: 'Missing required Svix headers' }, { status: 400 });
        }

        //  Read and verify the request payload
        const payload = await req.json();
        const body = JSON.stringify(payload);

        const wh = new Webhook(WEBHOOK_SECRET);
        let evt: WebhookEvent;

        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature
            }) as WebhookEvent;
        } catch (error) {
            console.error('Webhook verification failed:', error);
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
        }

        const eventType = evt.type;

        //  Check if the event type is valid and data exists
        if ((eventType === 'user.created' || eventType === 'user.updated') && isUserEvent(evt)) {
            const { id, email_addresses, first_name, last_name } = evt.data;
            const email = email_addresses[0]?.email_address;

            //  Upsert data into Supabase with error handling
            const { error } = await supabase
                .from('users')
                .upsert(
                    {
                        clerk_user_id: id,
                        email,
                        first_name: first_name || null,
                        last_name: last_name || null,
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: 'clerk_user_id' }
                );

            if (error) {
                console.error('Supabase error:', error);
                return NextResponse.json({ error: 'Failed to insert user into Supabase' }, { status: 500 });
            }

            return NextResponse.json({ message: 'User synced successfully' });
        }

        // Unhandled event types will return success but no action taken
        return NextResponse.json({ message: 'Unhandled event type or missing data' }, { status: 200 });
    } catch (err) {
        console.error('Unhandled server error:', err);
        return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
    }
}
