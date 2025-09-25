import { type ReactNode } from 'react'

import { BuyMeCoffee } from '@/shared/ui/BuyMeCoffee'

import Footer from './Footer'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-dvh w-full overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="w-full">
        {children}
      </main>
      <Footer />
      <BuyMeCoffee href="https://buymeacoffee.com" />
    </div>
  )
}

export default AppShell
