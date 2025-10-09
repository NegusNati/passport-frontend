import { toast as sonnerToast,Toaster as SonnerToaster } from 'sonner'

export const toast = sonnerToast

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast: 'bg-background/95 border border-border backdrop-blur supports-[backdrop-filter]:bg-background/70',
          description: 'text-muted-foreground',
        },
      }}
    />
  )
}
