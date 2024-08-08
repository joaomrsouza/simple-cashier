import { AdminLocker } from "@/components/admin-locker";
import { ThemeToggler } from "@/components/theme-toggler";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Rubik } from "next/font/google";
import Link from "next/link";

const rubikFont = Rubik({
  style: "italic",
  subsets: ["latin"],
  variable: "--font-title",
  weight: "500",
});

export function AppHeader() {
  return (
    <div className="flex w-full items-center justify-between border-b p-2 text-xl font-semibold">
      <Link
        href="/"
        className={cn("font-title antialiased", rubikFont.variable)}
      >
        Caixa $imples
      </Link>
      <span className="flex items-center gap-2">
        <Button asChild variant="link" className="text-sm">
          <a
            target="_blank"
            href="https://www.github.com/joaomrsouza"
            className={cn("font-title antialiased", rubikFont.variable)}
          >
            by @joaomrsouza
          </a>
        </Button>
        <AdminLocker />
        <ThemeToggler />
      </span>
    </div>
  );
}
