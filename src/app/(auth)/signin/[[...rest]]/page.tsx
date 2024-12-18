// src/pages/auth/signin/page.tsx
import { SignIn } from '@clerk/nextjs';
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="h-screen flex flex-col gap-6 items-center justify-center">
            <SignIn
                routing="path"
                path="/signin"
                forceRedirectUrl="/dashboard"
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