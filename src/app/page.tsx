import Link from "next/link";
import { HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col bg-[#FDFBF7] text-[#1A1A1A]">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-8 py-6">
          <div className="text-2xl font-serif font-bold tracking-wide">Gourmet<span className="text-orange-600">.</span></div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-base font-medium hover:bg-transparent hover:text-orange-600">Login</Button>
            </Link>
            <Link href="/auth/login">
              <Button className="bg-[#1A1A1A] text-white hover:bg-gray-800 rounded-none px-6">Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <span className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-600">Digital Menu Solution</span>
          <h1 className="mb-6 max-w-4xl font-serif text-6xl font-medium leading-tight sm:text-[5rem]">
            Elevate Your <br />
            <span className="italic text-gray-400">Dining Experience</span>
          </h1>
          <p className="mb-10 max-w-xl text-lg text-gray-600 leading-relaxed">
            A simple, elegant way to manage your restaurant's menu.
            Update prices instantly and let your customers dine with ease.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button size="lg" className="h-14 bg-orange-600 px-10 text-lg text-white hover:bg-orange-700 rounded-full shadow-lg shadow-orange-200">
                Create Your Menu
              </Button>
            </Link>
          </div>
        </div>

        {/* Minimal Features */}
        <div className="grid gap-12 px-6 py-24 md:grid-cols-3 max-w-6xl mx-auto border-t border-gray-200">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">✨</div>
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium">Elegant Design</h3>
            <p className="text-gray-500">Menus that look as good as your food.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">🚀</div>
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium">Instant Updates</h3>
            <p className="text-gray-500">Change items and prices in seconds.</p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-xl">📱</div>
            </div>
            <h3 className="mb-2 font-serif text-xl font-medium">QR Ready</h3>
            <p className="text-gray-500">Seamless scanning for every customer.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Gourmet Digital Systems.
        </footer>
      </main>
    </HydrateClient>
  );
}
