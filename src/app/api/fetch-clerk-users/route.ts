import { clerkClient } from "@clerk/clerk-sdk-node";

async function fetchAndStoreUsers() {  try {
    // Fetch users using the clerkClient singleton (no need for an API key here)
    const paginatedResponse = await clerkClient.users.getUserList();
    const clerkUsers = paginatedResponse.data; // Extract the array of users

    for (const user of clerkUsers) {
      const { id, primaryEmailAddress, firstName, lastName } = user;

      // Prepare user data
      const userData = {
        id: id,
        email: primaryEmailAddress?.emailAddress || 'No email',
        first_name: firstName || 'Unknown',
        last_name: lastName || 'Unknown'
      };

      console.log(`User fetched:`, userData);
    }
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
  }
}

// Run the function
fetchAndStoreUsers();
