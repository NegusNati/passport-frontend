import { type ReactNode } from 'react'

import mdFooterPattern from '@/assets/landingImages/md_footer_pattern.png'
import mobileFooterPattern from '@/assets/landingImages/mobile_footer_pattern.png'
import shaderUrl from '@/assets/landingImages/shader_bg.svg?url'
import { BuyMeCoffee } from '@/shared/ui/BuyMeCoffee'

import Footer from './Footer'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate bg-background text-foreground min-h-dvh w-full overflow-x-hidden">
      {/* Hero surface tint + blobs */}
      <div className="teal-hero pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div
        className="teal-blob-left pointer-events-none left-[-14rem] top-[-8rem] h-[24rem] w-[32rem] md:left-[-18rem] md:top-[-10rem] md:h-[28rem] md:w-[40rem] lg:left-[-20rem] lg:top-[-12rem] -z-10"
        aria-hidden
      />
      <div
        className="teal-blob-right pointer-events-none right-[-10rem] top-[2rem] h-[22rem] w-[30rem] md:right-[-12rem] md:top-[3rem] md:h-[26rem] md:w-[36rem] lg:right-[-14rem] lg:top-[4rem] -z-10"
        aria-hidden
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative z-0 w-full">
        {/* Absolutely positioned background image at the top */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-[-2rem] -z-10 h-[720px] w-full border-none"
          style={{
            backgroundImage: `url("${shaderUrl}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            width: '100%',
            height: '1120px',

          }}
        />
        {children}
      </main>

      <div className="relative flex items-center justify-center w-full mt-10 overflow-hidden">
        {/* left fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent"
          aria-hidden
        />
        <img
          src={mobileFooterPattern}
          alt=" footer pattern"
          className="block md:hidden max-w-full w-full h-auto"
        />

        <img
          src={mdFooterPattern}
          alt=" footer pattern"
          className="hidden md:block max-w-full w-full h-auto"
        />

        {/* right fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent"
          aria-hidden
        />

      </div>
      <Footer />
      <BuyMeCoffee href="https://buymeacoffee.com" />
    </div>
  )
}

export default AppShell
