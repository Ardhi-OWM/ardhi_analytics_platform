// src/pages/auth/signin/page.tsx
"use client";
import { useAuth, SignIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Updated hook for app directory
import Link from "next/link";

export default function SignInPage() {

    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        // Redirect to signup if there is no user in Clerk
        if (isSignedIn && !user) {
            router.push('/signup');
        }
    }, [isSignedIn, user, router]);
    
    return (
        <div className="h-screen flex flex-col gap-6 items-center justify-center">
            <SignIn
                routing="path"
                path="/signin"
                forceRedirectUrl="/#"
                appearance={{
                    elements: { footer: "hidden", formButtonPrimary: "bg-green-700" },
                }}
            />
            <div className="flex flex-row gap-2 text-sm">
                <p>Not a user yet?</p>
                <Link
                    href="/signup"
                    className="text-green-700 underline font-semibold"
                >
                    SIGN UP HERE.
                </Link>
            </div>
        </div>
    );
}
// src/pages/auth/signup/page.tsx