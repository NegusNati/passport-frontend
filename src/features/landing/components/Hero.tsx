import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

import { M } from '@/shared/lib/motion'
import { Button } from '@/shared/ui/button'

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="grid max-w-2xl items-center gap-10 pt-14 sm:pt-20">
      <>
        <div>
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: M.duration, ease: M.ease }}
            className="space-y-4"
          >
            {/* Stats Badge */}
            <div className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-4 py-2 text-sm">
              Over 1.5 million users, with 800,000 passports confirmed as issued.
            </div>

            <h1 className="max-w-3xl text-2xl font-bold sm:text-3xl md:text-3xl">
              Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
            </h1>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
              Search with your reference number or name and get real-time updates—no more repeated
              trips to the office.
            </p>
            <div className="mt-6 flex w-full flex-col items-start gap-3 sm:w-auto sm:flex-row">
              <Button size="sm" className="w-full py-0 sm:w-auto">
                <Link to="/">
                  Check My Passport Status Now
                  <ArrowRightIcon className="ml-2 inline h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2">
                <p className="text-muted-foreground text-sm">or</p>
                <a
                  href="#telegram"
                  className="text-foreground inline-flex items-center text-sm font-medium underline-offset-4 hover:underline"
                >
                  Join Telegram Group
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Placeholders */}
        <div className="my-12 flex space-x-4">
          <div className="bg-muted h-24 w-full"></div>
          <div className="bg-muted h-24 w-full"></div>
        </div>
      </>
    </section>
  )
}

export default Hero
