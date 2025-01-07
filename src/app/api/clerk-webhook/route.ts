import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const event = req.body;

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
          return res.status(500).json({ error: 'Failed to sync user' });
        }

        return res.status(200).json({ success: true, data });

      case 'user.deleted':
        // Delete user from Supabase
        const { id: deletedUserId } = event.data;

        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('clerk_user_id', deletedUserId);

        if (deleteError) {
          console.error('Error deleting user from Supabase:', deleteError);
          return res.status(500).json({ error: 'Failed to delete user' });
        }

        return res.status(200).json({ success: true });

      default:
        return res.status(200).json({ message: 'Unhandled event type' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}