import { ThemeProvider } from "next-themes";
import { ClerkProvider} from '@clerk/nextjs'
import { Space_Grotesk } from "next/font/google";

import './globals.css'
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";

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

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
