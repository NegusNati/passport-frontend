import { motion } from 'framer-motion'

import ShhhImage from '@/assets/landingImages/shhh.svg'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

interface ComingSoonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}

export function ComingSoonDialog({ open, onOpenChange, title }: ComingSoonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="m-2 w-[calc(80vw-2rem)] max-w-[560px] self-center p-4 sm:mx-0 sm:w-full sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>{title || 'Coming Soon'}</DialogTitle>
          <DialogDescription>This feature is coming soon</DialogDescription>
        </DialogHeader>

        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 sm:py-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Image */}
          <motion.div
            className="flex-shrink-0"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.4, type: 'spring' }}
          >
            <img
              src={ShhhImage}
              alt="Shh gesture"
              className="h-32 w-auto sm:h-36"
              width="144"
              height="144"
            />
          </motion.div>

          {/* Text */}
          <motion.div
            className="text-center sm:text-left"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <p className="text-foreground text-base leading-relaxed sm:text-lg">
              Our Privacy Policy and Terms are still in the oven — nothing&apos;s really cooked yet,
              but we promise it&apos;ll smell official when ready.
            </p>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
