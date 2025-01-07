import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { supabase } from '@/lib/supabaseClient';

const webhookSecret: string = process.env.CLERK_WEBHOOK_SECRET!;

interface ClerkEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    const event = wh.verify(payload, headers) as ClerkEvent;

    // Handle Clerk events
    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        const { id, email_addresses, first_name, last_name } = event.data;
        const email = email_addresses[0]?.email_address;

        const { data, error } = await supabase
          .from('users')
          .upsert(
            {
              clerk_user_id: id,
              email,
              first_name,
              last_name,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'clerk_user_id' }
          )
          .select();

        if (error) {
          console.error('Error syncing user to Supabase:', error);
          return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
      }

      case 'user.deleted': {
        const { id: deletedUserId } = event.data;

        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('clerk_user_id', deletedUserId);

        if (deleteError) {
          console.error('Error deleting user from Supabase:', deleteError);
          return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ message: 'Unhandled event type' });
    }
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }
}
