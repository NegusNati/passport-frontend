
import { Button } from '@/shared/ui/button'
import { motion, useReducedMotion } from 'framer-motion'
import { M } from '@/shared/lib/motion'
import { ArrowRightIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Hero() {
  const reduce = useReducedMotion()
  return (
    <section className="pt-14 sm:pt-20 grid items-center gap-10 max-w-2xl ">
      <div>
        <motion.div initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: M.duration, ease: M.ease }} className='space-y-4'>
          {/* Stats Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-neutral-100 rounded-full text-sm text-muted-foreground ">
            Over 1.5 million users, with 800,000 passports confirmed as issued.
          </div>

          <h1 className="text-2xl font-bold sm:text-3xl md:text-3xl max-w-3xl">
            Tired of endless uncertainty? Instantly know if your Ethiopian passport is ready.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 leading-relaxed">
            Search with your reference number or name and get real-time updates—no more repeated trips to the office.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row w-full sm:w-auto ">
            <Button size="sm" className="w-full sm:w-auto py-0 ">
              <Link to="/">
                Check My Passport Status Now
                <ArrowRightIcon className="ml-2 h-4 w-4 inline" aria-hidden="true" />
              </Link>
            </Button>
            <div className="flex items-center gap-2 justify-center ">
            <p className="text-sm text-neutral-600">or</p>
            <a href="#telegram" className="inline-flex items-center text-sm font-medium text-neutral-900 underline-offset-4 hover:underline">
              Join Telegram Group
            </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Image Placeholders */}
      <div className="flex space-x-4 my-12">
        <div className="bg-neutral-200 h-24 w-full"></div>
        <div className="bg-neutral-200 h-24 w-full"></div>
      </div>

    </section>
  )
}

export default Hero
