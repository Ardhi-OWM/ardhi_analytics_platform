import { SignUp } from '@clerk/nextjs';
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="flex flex-col gap-6 items-center justify-center h-screen">
            <SignUp 
            routing="path" 
            path="/signup" 
            forceRedirectUrl="/signin"
            appearance={{
                elements: { footer: "hidden", formButtonPrimary: "bg-green-700" },
            }}
            />
            <div className="flex flex-row gap-1 text-sm">
                <p>Already a user?</p>
                <Link
                    href="/sign-in"
                    className="text-green-700 underline font-semibold"
                >
                    SIGN IN HERE.
                </Link>
            </div>
        </div>
    );
}
