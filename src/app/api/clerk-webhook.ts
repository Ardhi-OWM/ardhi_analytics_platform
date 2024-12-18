import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract user data from the webhook payload
        const userData = req.body;

        // Add the user to the 'users' table in Supabase
        const { data, error } = await supabase.from('users').insert([
            {
                id: userData.id, // Clerk user ID
                email: userData.email_addresses[0].email_address, // User's primary email
                name: `${userData.first_name} ${userData.last_name}`, // Full name
                created_at: userData.created_at, // Timestamp from Clerk
            },
        ]);

        if (error) {
            console.error('Error inserting user into Supabase:', error);
            return res.status(500).json({ error: 'Failed to insert user into database' });
        }

        res.status(200).json({ message: 'User added successfully', data });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
