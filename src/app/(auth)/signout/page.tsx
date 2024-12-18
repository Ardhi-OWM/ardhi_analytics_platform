import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { SignedOut } from '@clerk/nextjs';

export default function SignOutPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/signin');
    }, [router]);

    return (
        <SignedOut />
    );
}
