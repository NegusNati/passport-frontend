import { type ReactNode } from 'react'

import mdFooterPattern from '@/assets/landingImages/md_footer_pattern.png'
import mobileFooterPattern from '@/assets/landingImages/mobile_footer_pattern.png'
import shaderUrl from '@/assets/landingImages/shader_bg.svg?url'
import { useLanguageSync } from '@/shared/hooks/useLanguageSync'
import { usePageTracking } from '@/shared/hooks/usePageTracking'
import { BuyMeCoffee } from '@/shared/ui/BuyMeCoffee'
import { Toaster } from '@/shared/ui/sonner'

import Footer from './Footer'
import { Header } from './Header'

export function AppShell({ children }: { children: ReactNode }) {
  // Track all page views automatically
  usePageTracking()
  // Sync URL ?lang= param with i18n language
  useLanguageSync()
  return (
    <div className="bg-background text-foreground relative isolate min-h-dvh w-full overflow-x-hidden">
      {/* Hero surface tint + blobs */}
      <div className="teal-hero pointer-events-none absolute inset-0 -z-10" aria-hidden />
      <div
        className="teal-blob-left pointer-events-none top-[-8rem] left-[-14rem] -z-10 h-[24rem] w-[32rem] md:top-[-10rem] md:left-[-18rem] md:h-[28rem] md:w-[40rem] lg:top-[-12rem] lg:left-[-20rem]"
        aria-hidden
      />
      <div
        className="teal-blob-right pointer-events-none top-[2rem] right-[-10rem] -z-10 h-[22rem] w-[30rem] md:top-[3rem] md:right-[-12rem] md:h-[26rem] md:w-[36rem] lg:top-[4rem] lg:right-[-14rem]"
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
          className="pointer-events-none absolute top-[-2rem] left-0 -z-10 h-[720px] w-full border-none"
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

      <div className="relative mt-10 flex w-full items-center justify-center overflow-hidden">
        {/* left fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent"
          aria-hidden
        />
        <img
          src={mobileFooterPattern}
          alt=" footer pattern"
          className="block h-auto w-full max-w-full md:hidden"
        />

        <img
          src={mdFooterPattern}
          alt=" footer pattern"
          className="hidden h-auto w-full max-w-full md:block"
        />

        {/* right fade */}
        <div
          className="from-background pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent"
          aria-hidden
        />
      </div>
      <Footer />
      <BuyMeCoffee href="https://ye-buna.com/PassportET" />
      <Toaster />
    </div>
  )
}

export default AppShell
