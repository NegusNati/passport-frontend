import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, MegaphoneIcon } from 'lucide-react';

const Footer = () => {
  const services = [
    'Advertisement',
    'Passport Check',
    'Ethiopian Calendar',
    'Gee\'z Numbers',
    'Amharic Alphabets'
  ];

  const socials = [
    { name: 'GitHub', icon: <GithubIcon className="size-4" />, url: '#' },
    { name: 'X (Formerly Twitter)', icon: <TwitterIcon className="size-4" />, url: '#' },
    { name: 'LinkedIn', icon: <LinkedinIcon className="size-4" />, url: '#' },
    { name: 'Instagram', icon: <InstagramIcon className="size-4" />, url: '#' }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.footer
      className="relative border-t border-neutral-200 pt-16 pb-8 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Background watermark positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none translate-y-2">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16
                   bg-gradient-to-t from-white to-transparent dark:from-neutral-950"
        aria-hidden
      />
        <motion.div
          className="text-gray-200 font-bold text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8] xl:text-[10rem] 2xl:text-[12rem] leading-none select-none  "
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Passport.ET
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-54 ">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-8">
          {/* Company Info */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <div>
              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Passport.ET
              </motion.h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                No more wasted trips. Know your passport status instantly.
              </p>
            </div>

            <motion.a
              href="#"
              className="inline-flex items-center space-x-2  hover:text-blue-800 transition-colors duration-300"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>💬</span>
              <span className="font-medium ">Join Telegram Group</span>
            </motion.a>
          </motion.div>

          {/* Services */}
          <motion.div
            className="space-y-4"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900">Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <motion.li key={index}>
                  <motion.a
                    href="#"
                    className="text-gray-600 hover:text-green-600 transition-colors duration-300 block"
                    whileHover={{ x: 5, color: "#16a34a" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {service === 'Advertisement' ? (
                      <span className='flex items-center gap-2 bg-neutral-50 rounded-md py-1 px-4 w-fit border border-neutral-100'>
                        <MegaphoneIcon className="size-4" style={{ transform: 'scaleX(-1)' }} />
                        Advertisement
                      </span>

                    ) : service}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Developer Socials */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-gray-900">Developer Socials</h3>
            <ul className="space-y-3">
              {socials.map((social, index) => (
                <motion.li key={index}>
                  <motion.a
                    href={social.url}
                    className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors duration-300"
                    whileHover={{ x: 5, color: "#ca8a04" }}
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
        <motion.div
          className="pt-8 border-t border-gray-200"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.p
              className="text-sm text-gray-500"
              whileHover={{ scale: 1.02 }}
            >
              ©2025 Passport.ET. All rights reserved.
            </motion.p>

            <div className="flex space-x-6">
              <motion.a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300 border-b border-transparent hover:border-gray-900"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Terms & Conditions
              </motion.a>
              <motion.a
                href="#"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-300 border-b border-transparent hover:border-gray-900"
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
  );
};

export default Footer;
