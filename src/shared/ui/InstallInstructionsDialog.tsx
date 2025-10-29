import { motion, useReducedMotion } from 'framer-motion'
import { Plus, Share2 } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

interface InstallInstructionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform?: 'ios' | 'android' | 'desktop' | 'unknown'
}

export function InstallInstructionsDialog({
  open,
  onOpenChange,
  platform = 'ios',
}: InstallInstructionsDialogProps) {
  const shouldReduceMotion = useReducedMotion()

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
      }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="m-2 w-[calc(90vw-2rem)] max-w-[440px] self-center p-4 sm:mx-0 sm:w-full sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">Install Passport.ET</DialogTitle>
          <DialogDescription>Add this app to your home screen for quick access</DialogDescription>
        </DialogHeader>

        <motion.div className="space-y-4 pt-2" {...animationProps}>
          {platform === 'ios' ? (
            <>
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tap the Share button</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="bg-primary/20 rounded p-2">
                        <Share2 className="text-primary h-5 w-5" />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        Located at the bottom of Safari
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Select &quot;Add to Home Screen&quot;</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="bg-primary/20 rounded p-2">
                        <Plus className="text-primary h-5 w-5" />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        Scroll down in the share menu
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tap &quot;Add&quot;</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      The app icon will appear on your home screen
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-center text-xs">
                Note: This feature is only available in Safari browser
              </p>
            </>
          ) : (
            <>
              <div className="bg-muted/50 space-y-3 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Open in Chrome or Edge</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      PWA installation works best in Chrome or Edge browser
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tap the menu (⋮)</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Look for &quot;Install app&quot; or &quot;Add to Home screen&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Confirm installation</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      The app will be added to your home screen
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
