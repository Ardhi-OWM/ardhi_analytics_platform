import { ThemeSwitcher } from "@/components/shared/theme/theme-switcher";





export default function Home() {

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      "Missing Clerk publishable key. Ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in your environment variables."
    );
  }
  console.log('Publishable Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  console.log("Publishable Key:", publishableKey);
  console.log("hello world");

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          <h1> This is the main page</h1>
          <ThemeSwitcher />
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <h4 className="roboto-mono-regular"> This is the Footer</h4>
      </footer>
    </div>
  );
}
