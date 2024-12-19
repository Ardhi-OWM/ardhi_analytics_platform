

import { UserButton, SignedIn } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from '../theme/theme-switcher'
import NavBar from './NavBar'
export default function Header() {

    return (
        <SignedIn>
            <header className="w-full fixed top-0 left-0 border-b border-gray-500/[.25] shadow-lg z-[1000]">
                <div className="flex items-center flex-row justify-between mx-2">
                    <div className="my-2">
                        <Link href="/" >
                            <Image
                                src="/logo/logo.png"
                                width={128}
                                height={64}
                                alt="Ardhi logo"
                                priority
                                className="w-24 sm:w-30 md:w-40 aspect-auto"
                            />
                        </Link>
                    </div>
                    <NavBar />
                    <div className="flex items-center gap-2">
                        {/* Reserve space for UserButton */}
                        <div className="w-10 h-10 flex items-center justify-center">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonTrigger: "bg-green-500 rounded-full px-1 py-1",
                                        modalFooter: "hidden",
                                    },
                                }}
                            />
                        </div>

                        {/* Reserve space for ThemeSwitcher */}
                        <div className="w-10 h-10 flex items-center justify-center flex-none px-1">
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </header>
        </SignedIn>
    )
}