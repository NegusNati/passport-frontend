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
          <DialogDescription>
            Add this app to your home screen for quick access
          </DialogDescription>
        </DialogHeader>

        <motion.div className="space-y-4 pt-2" {...animationProps}>
          {platform === 'ios' ? (
            <>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tap the Share button</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-primary/20 rounded p-2">
                        <Share2 className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        Located at the bottom of Safari
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Select &quot;Add to Home Screen&quot;</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-primary/20 rounded p-2">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-muted-foreground text-xs">
                        Scroll down in the share menu
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tap &quot;Add&quot;</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      The app icon will appear on your home screen
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground text-xs text-center">
                Note: This feature is only available in Safari browser
              </p>
            </>
          ) : (
            <>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Open in Chrome or Edge</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      PWA installation works best in Chrome or Edge browser
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tap the menu (⋮)</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Look for &quot;Install app&quot; or &quot;Add to Home screen&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Confirm installation</p>
                    <p className="text-muted-foreground text-xs mt-1">
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
