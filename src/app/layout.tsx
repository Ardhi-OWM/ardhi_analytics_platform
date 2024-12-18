import { ThemeProvider } from "next-themes";
import {
  ClerkProvider,UserButton , SignedIn,
  // SignedOut, SignInButton
}
  from '@clerk/nextjs'
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;


import './globals.css'
import { Space_Grotesk } from "next/font/google";


export const metadata = {
  title: "Ardhi App",
  description: "Ardhi simplifies geospatial analysis, enabling users to visualize and download data effortlessly, supporting data-driven decisions across diverse industries.",
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  fallback: ["sans-serif"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" className={spaceGrotesk.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <header className="flex justify-between items-center p-4">
              <nav>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </nav>
            </header>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
