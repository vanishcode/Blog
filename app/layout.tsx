import Link from "next/link"
import "./globals.css"
import { JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { ModeToggle } from "@/components/mode-toggle"
import { CurrentYear } from "@/components/current-year"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jetbrains-mono",
})

export const metadata = {
  title: "Vanishcode's Blog",
  description: "A blog about web development, programming, and technology.",
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="antialiased min-h-screen font-mono bg-bg text-ink flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="border-b border-line">
            <div className="w-full max-w-[1120px] mx-auto px-4 py-[18px] flex items-center justify-between gap-5">
              <Link
                href="/"
                className="font-semibold tracking-tight text-ink hover:text-ink"
              >
                vanishcode
              </Link>
              <nav className="ml-auto text-sm font-medium flex items-center gap-6">
                <ModeToggle />
              </nav>
            </div>
          </header>

          <main className="flex-1">
            <div className="w-full max-w-[1120px] mx-auto px-4 py-8">
              {children}
            </div>
          </main>

          <footer className="text-muted">
            <div className="w-full max-w-[1120px] mx-auto px-4 pt-[14px] pb-8 mt-4 border-t border-line flex items-center justify-between gap-3 text-[13px]">
              <span>
                © <CurrentYear />,{" "}
                <a
                  href="https://github.com/vanishcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  vanishcode
                </a>
              </span>
              <a href="mailto:vanishcode@outlook.com">vanishcode@outlook.com</a>
            </div>
          </footer>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
