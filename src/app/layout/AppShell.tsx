import { type ReactNode } from 'react'

import { BuyMeCoffee } from '@/shared/ui/BuyMeCoffee'

import Footer from './Footer'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-dvh w-full overflow-x-hidden">
         {/* Hero surface tint + blobs */}
         <div className="teal-hero absolute inset-0" aria-hidden />
      <div
        className="teal-blob-left left-[-14rem] top-[-8rem] h-[24rem] w-[32rem] md:left-[-18rem] md:top-[-10rem] md:h-[28rem] md:w-[40rem] lg:left-[-20rem] lg:top-[-12rem]"
        aria-hidden
      />
      <div
        className="teal-blob-right right-[-10rem] top-[2rem] h-[22rem] w-[30rem] md:right-[-12rem] md:top-[3rem] md:h-[26rem] md:w-[36rem] lg:right-[-14rem] lg:top-[4rem]"
        aria-hidden
      />

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
