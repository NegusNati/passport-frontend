import React from 'react'
import { Header } from './Header'
import Footer from './Footer'
import { BuyMeCoffee } from '@/shared/ui/BuyMeCoffee'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-neutral-900">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white">Skip to content</a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <BuyMeCoffee href="https://buymeacoffee.com" />
    </div>
  )
}

export default AppShell
