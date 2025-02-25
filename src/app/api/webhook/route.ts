import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { WebhookEvent } from '@clerk/nextjs/server';

//  Improved environment variable handling with fallback error
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

//  Validate environment variables at runtime
if (!WEBHOOK_SECRET) {
    throw new Error('Required environment variables are missing. Check your .env file.');
}

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

            console.log(`User event received: ID=${id}, Email=${email}, First Name=${first_name}, Last Name=${last_name}`);

            return NextResponse.json({ message: 'User event processed successfully' });
        }

        // Unhandled event types will return success but no action taken
        return NextResponse.json({ message: 'Unhandled event type or missing data' }, { status: 200 });
    } catch (err) {
        console.error('Unhandled server error:', err);
        return NextResponse.json({ error: 'Server error occurred' }, { status: 500 });
    }
}
