import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL or Key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  const event = await request.json();

  switch (event.type) {
    case 'user.created':
    case 'user.updated':
      // Sync user data to Supabase
      const { id, email_addresses, first_name, last_name } = event.data;
      const email = email_addresses[0].email_address;

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

    case 'user.deleted':
      // Delete user from Supabase
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

    default:
      return NextResponse.json({ message: 'Unhandled event type' });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export function PUT() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}