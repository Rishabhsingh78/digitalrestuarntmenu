import Link from "next/link";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Digital Menu <span className="text-[hsl(280,100%,70%)]">System</span>
          </h1>
          <div className="flex flex-col items-center gap-4">
            <p className="text-2xl text-white">
              Welcome! Please configure your database to get started.
            </p>
            <Link
              href="/auth/login"
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
