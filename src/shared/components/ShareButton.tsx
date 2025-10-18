import { Check, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

import telegramIcon from '@/assets/logos/telegram-logo.svg'
import { useAnalytics } from '@/shared/lib/analytics'
import { Button, type ButtonProps } from '@/shared/ui/button'

interface ShareButtonProps {
  url: string
  title?: string
  resultType?: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}

export function ShareButton({
  url,
  title = 'Check out this passport status',
  resultType,
  variant = 'outline',
  size = 'md',
}: ShareButtonProps) {
  const { capture } = useAnalytics()
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const handleShare = (channel: string) => {
    capture('share_status_link', {
      channel,
      'result-type': resultType || 'unknown',
    })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      handleShare('copy')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToWhatsApp = () => {
    handleShare('whatsapp')
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`
    window.open(whatsappUrl, '_blank')
    setShowOptions(false)
  }

  const shareToTelegram = () => {
    handleShare('telegram')
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(telegramUrl, '_blank')
    setShowOptions(false)
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        })
        handleShare('native')
        setShowOptions(false)
      } catch (err) {
        console.error('Share failed:', err)
      }
    }
  }

  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        className="gap-2 flex items-center"
        onClick={() => setShowOptions(!showOptions)}
      >
        <p className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        <span className="hidden md:block">Share</span> </p>
      </Button>

      {showOptions && (
        <>
          <button
            type="button"
            aria-label="Close share options"
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowOptions(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowOptions(false)
              }
            }}
          />
          <div className="absolute top-full right-0 z-[9999] mt-2 w-48 rounded-md border border-border bg-popover text-popover-foreground p-2 shadow-md">
            <button
              onClick={copyToClipboard}
              className="flex w-full items-center rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </button>
            <button
              onClick={shareToWhatsApp}
              className="flex w-full items-center rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </button>
            <button
              onClick={shareToTelegram}
              className="flex w-full items-center rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <img src={telegramIcon} alt="Telegram" className="mr-2 h-5 w-5" />
              Telegram
            </button>
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={nativeShare}
                className="flex w-full items-center rounded px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Share2 className="mr-2 h-4 w-4" />
                More Options...
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
