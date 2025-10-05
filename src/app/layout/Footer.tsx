import { motion } from 'framer-motion'
import { GithubIcon, InstagramIcon, LinkedinIcon, MegaphoneIcon, TwitterIcon } from 'lucide-react'

const Footer = () => {
  const services = [
    'Advertisement',
    'Passport Check',
    'Ethiopian Calendar',
    "Gee'z Numbers",
    'Amharic Alphabets',
  ]

  const socials = [
    { name: 'GitHub', icon: <GithubIcon className="size-4" />, url: '#' },
    { name: 'X (Formerly Twitter)', icon: <TwitterIcon className="size-4" />, url: '#' },
    { name: 'LinkedIn', icon: <LinkedinIcon className="size-4" />, url: '#' },
    { name: 'Instagram', icon: <InstagramIcon className="size-4" />, url: '#' },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  return (
    <motion.footer
      className="border-border relative overflow-hidden border-t pt-16 pb-4 md:pb-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Background watermark positioned at bottom */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex translate-y-2 items-end justify-center">
        <div
          className="from-primary/40 pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
          aria-hidden
        />
        <motion.div
          className="text-primary/40 text-[4.5rem] leading-none font-bold select-none sm:text-[6rem] md:text-[8rem] lg:text-[8] xl:text-[10rem] 2xl:text-[12rem]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Passport.ET
        </motion.div>
      </div>

      <div className="relative z-10 mx-auto mb-54 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Company Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <div>
              <motion.h2
                className="text-primary mb-2 text-2xl font-bold"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                Passport.ET
              </motion.h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No more wasted trips. Know your passport status instantly.
              </p>
            </div>

            <motion.a
              href="#"
              className="inline-flex items-center space-x-2 transition-colors duration-300 hover:text-foreground"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>💬</span>
              <span className="font-medium">Join Telegram Group</span>
            </motion.a>
          </motion.div>

          {/* Services */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <h3 className="text-foreground text-lg font-semibold">Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li key={index}>
                  <motion.a
                    href="#"
                    className="text-muted-foreground hover:text-primary block transition-colors duration-300"
                    whileHover={{ x: 5, color: 'hsl(var(--primary))' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {service === 'Advertisement' ? (
                      <span className="bg-muted border-border flex w-fit items-center gap-2 rounded-md border px-4 py-1">
                        <MegaphoneIcon className="size-4" style={{ transform: 'scaleX(-1)' }} />
                        Advertisement
                      </span>
                    ) : (
                      service
                    )}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Developer Socials */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <h3 className="text-foreground text-lg font-semibold">Developer Socials</h3>
            <ul className="space-y-3">
              {socials.map((social, index) => (
                <motion.li key={index}>
                  <motion.a
                    href={social.url}
                    className="text-muted-foreground hover:text-primary flex items-center space-x-2 transition-colors duration-300"
                    whileHover={{ x: 5, color: 'hsl(var(--primary))' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>{social.icon}</span>
                    <span>{social.name}</span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div className="border-border border-t pt-8" variants={itemVariants}>
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <motion.p className="text-muted-foreground text-sm" whileHover={{ scale: 1.02 }}>
              ©2025 Passport.ET. All rights reserved.
            </motion.p>

            <div className="flex space-x-6">
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:border-foreground border-b border-transparent text-sm transition-colors duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Terms & Conditions
              </motion.a>
              <motion.a
                href="#"
                className="text-muted-foreground hover:text-foreground hover:border-foreground border-b border-transparent text-sm transition-colors duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Privacy Policy
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
