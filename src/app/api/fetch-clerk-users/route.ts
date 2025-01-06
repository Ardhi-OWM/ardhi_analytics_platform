import { clerkClient } from "@clerk/clerk-sdk-node";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchAndStoreUsers() {
  try {
    // Fetch users using the clerkClient singleton (no need for an API key here)
    const paginatedResponse = await clerkClient.users.getUserList();
    const clerkUsers = paginatedResponse.data; // Extract the array of users

    for (const user of clerkUsers) {
      const { id, primaryEmailAddress, firstName, lastName } = user;

      // Prepare user data for Supabase insertion
      const userData = {
        id: id,
        email: primaryEmailAddress?.emailAddress || 'No email',
        first_name: firstName || 'Unknown',
        last_name: lastName || 'Unknown'
      };

      // Insert or update the user in the Supabase 'user' table
      const { error } = await supabase.from('user').upsert([userData]);

      if (error) {
        console.error('Error inserting user:', error);
      } else {
        console.log(`User ${primaryEmailAddress?.emailAddress} added successfully.`);
      }
    }
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
  }
}

// Run the function
fetchAndStoreUsers();
