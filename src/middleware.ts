import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define route matchers
const isProtectedRoute = createRouteMatcher([
    "/dashboard/:path*",   // Matches /dashboard
    '/converter',           // Matches /converter
    '/api-connections',     // Matches /api-connections
    '/maptry',     // Matches /api-connections
    '/',
]);

// Custom middleware logic
export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();


    // Redirect unauthenticated users from protected routes to /signin
    if (!userId && isProtectedRoute(req)) {
        const loginUrl = new URL('/signin', req.url);
        return NextResponse.redirect(loginUrl);
    }

    // Allow all other routes to pass through
    return NextResponse.next();
});

export const config = {
    matcher: [
        '/', // Protect the home page
        "/dashboard/:path*", // Protect dashboard route and sub-routes
        '/converter',           // Matches /converter
        '/api-connections',     // Matches /api-connections
        // Ensure auth routes are excluded
        '/((?!signin|signup).*)', // Exclude /signin, /signup, and /signout
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
