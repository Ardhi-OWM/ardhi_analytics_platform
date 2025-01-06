import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { supabase } from '@/lib/supabaseClient';

// Import crypto for manual signature validation
import crypto from 'crypto';

// Load the Webhook Signing Secret from the .env.local file
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

// Verify webhook signature manually
function verifyClerkWebhookSignature(rawBody: string, headers: Headers) {
    const signature = headers.get('clerk-signature') || '';
    const hmac = crypto.createHmac('sha256', CLERK_WEBHOOK_SECRET);
    hmac.update(rawBody, 'utf8');
    const calculatedSignature = hmac.digest('base64');

    if (signature !== calculatedSignature) {
        throw new Error('Webhook signature verification failed');
    }
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text(); // Raw body for signature verification
        const headers = new Headers(req.headers);

        // Verify the webhook signature
        verifyClerkWebhookSignature(rawBody, headers);

        // If the signature is valid, parse the payload
        const payload = JSON.parse(rawBody);
        console.log('✅ Webhook Verified Successfully:', payload);

        if (payload.type !== 'user.created') {
            return NextResponse.json({ message: 'Event type not handled' }, { status: 200 });
        }

        const { id, email_addresses, first_name, last_name, primary_email_address_id } = payload.data;

        // Extract the primary email
        const primaryEmail = email_addresses.find(
            (email: any) => email.id === primary_email_address_id
        )?.email_address;

        if (!primaryEmail) {
            console.error('❌ Missing Primary Email');
            return NextResponse.json({ error: 'Invalid data received' }, { status: 400 });
        }

        // Insert the user into Supabase
        const { error } = await supabase.from('users').upsert([
            {
                id,
                email: primaryEmail,
                name: `${first_name || ''} ${last_name || ''}`.trim(),
                created_at: new Date().toISOString()
            }
        ]);

        if (error) {
            console.error('❌ Supabase Insert Error:', error);
            return NextResponse.json({ error: 'Failed to insert into Supabase' }, { status: 500 });
        }

        console.log('✅ User successfully added to Supabase!');
        return NextResponse.json({ message: 'User added successfully!' });
    } catch (error) {
        console.error('❌ Webhook Error:', error);
        return NextResponse.json({ error: 'Unauthorized or Invalid Webhook Signature' }, { status: 401 });
    }
}
