import "@/styles/globals.css";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { AppHeader } from "./_components/app-header";
import { ThemeProvider } from "./_components/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  description: "Caixa Simples by @joaomrsouza",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  title: "Caixa $imples",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br" className={`${GeistSans.variable}`}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          enableSystem
          disableTransitionOnChange
          attribute="class"
          defaultTheme="system"
        >
          <div className="grid h-screen grid-rows-[auto,1fr]">
            <AppHeader />
            <div className="overflow-y-auto">
              <div className="m-2 mr-0 h-full overflow-y-auto">
                <main className="mb-4 mr-2 rounded-md border p-2">
                  {children}
                </main>
              </div>
            </div>
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
