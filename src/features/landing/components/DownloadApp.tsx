import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import appStore from '@/assets/landingImages/app_store.svg'
import playStore from '@/assets/landingImages/play_store.svg'
import { usePWAInstall } from '@/shared/hooks/usePWAInstall'
import { useAnalytics } from '@/shared/lib/analytics'
import { Container } from '@/shared/ui/container'
import { InstallInstructionsDialog } from '@/shared/ui/InstallInstructionsDialog'
import { toast } from '@/shared/ui/sonner'

export function DownloadAppSection() {
  const { t } = useTranslation('landing')
  const { t: tCommon } = useTranslation()
  const [showIOSDialog, setShowIOSDialog] = useState(false)
  const { canInstall, isStandalone, platform, promptInstall } = usePWAInstall()
  const { capture } = useAnalytics()

  const handleInstallClick = async (buttonType: 'android' | 'ios') => {
    capture('pwa_install_attempt', {
      source: 'download-section',
      button: buttonType,
      platform,
      'can-install': canInstall,
      'is-standalone': isStandalone,
    })

    if (isStandalone) {
      toast(tCommon('pwa.alreadyInstalled'), {
        description: tCommon('pwa.alreadyInstalledDesc'),
      })
      return
    }

    if (canInstall) {
      const result = await promptInstall()
      if (result === 'accepted') {
        toast(tCommon('pwa.appInstalled'), {
          description: tCommon('pwa.appInstalledDesc'),
        })
      } else if (result === 'dismissed') {
        toast(tCommon('pwa.installCancelled'), {
          description: tCommon('pwa.installCancelledDesc'),
        })
      }
      return
    }

    if (platform === 'ios' && buttonType === 'ios') {
      capture('pwa_install_ios_instructions_shown', { source: 'download-section' })
      setShowIOSDialog(true)
      return
    }

    if (platform === 'ios') {
      toast(tCommon('pwa.installNotAvailable'), {
        description: tCommon('pwa.installNotAvailableDesc'),
      })
      return
    }

    toast(tCommon('pwa.installNotAvailable'), {
      description: tCommon('pwa.installNotAvailableDesc'),
    })
  }

  return (
    <section id="download" className="py-10 sm:py-12" aria-label="Sponsored advertisement">
      <Container>
        <div className="bg-muted relative flex flex-row items-center gap-6 overflow-hidden px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12 lg:flex-col lg:text-left">
          <div className="max-w-2xl items-center space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">{t('downloadApp.title')}</h2>
            <p className="text-muted-foreground text-sm">
              {t('downloadApp.description')}
            </p>
            <div className="my-4 flex items-center gap-6 sm:w-full md:w-auto">
              <button
                type="button"
                onClick={() => handleInstallClick('android')}
                aria-label="Get it on Google Play"
                className="focus-visible:outline-primary rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <img
                  src={playStore}
                  alt="Get it on Google Play"
                  className="h-[45px]"
                  width="135"
                  height="45"
                />
              </button>
              <button
                type="button"
                onClick={() => handleInstallClick('ios')}
                aria-label="Download on the App Store"
                className="focus-visible:outline-primary rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <img
                  src={appStore}
                  alt="Download on the App Store"
                  className="h-[45px]"
                  width="135"
                  height="45"
                />
              </button>
            </div>
          </div>
        </div>
      </Container>
      <InstallInstructionsDialog
        open={showIOSDialog}
        onOpenChange={setShowIOSDialog}
        platform={platform}
      />
    </section>
  )
}
