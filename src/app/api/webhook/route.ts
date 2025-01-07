import { NextApiRequest, NextApiResponse } from 'next';
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payload = JSON.stringify(req.body);
    const headers = req.headers;

    // Verify the webhook signature
    const wh = new Webhook(webhookSecret);
    try {
      const event = wh.verify(payload, headers as Record<string, string>) as ClerkEvent;

      // Handle Clerk events
      switch (event.type) {
        case 'user.created':
        case 'user.updated':
          const { id, email_addresses, first_name, last_name } = event.data;
          const email = email_addresses[0].email_address;

          // Upsert user into Supabase
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
          const { id: deletedUserId } = event.data;

          // Delete user from Supabase
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
    } catch (err) {
      console.error('Webhook verification failed:', err);
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}