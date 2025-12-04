import { Link } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/shared/ui/button'

interface AdvertisementRequestSuccessProps {
  onSubmitAnother: () => void
}

export function AdvertisementRequestSuccess({ onSubmitAnother }: AdvertisementRequestSuccessProps) {
  const { t } = useTranslation('advertisements')

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
      <div className="bg-primary/10 text-primary rounded-full p-5">
        <CheckCircle className="h-14 w-14" />
      </div>

      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold">{t('request.success.title')}</h2>
        <p className="text-muted-foreground max-w-md text-base">
          {t('request.success.description')}
        </p>
      </div>

      <div className="bg-muted/60 max-w-lg rounded-lg p-6 text-left">
        <h3 className="text-foreground mb-2 text-sm font-semibold">
          {t('request.success.whatNext.title')}
        </h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{t('request.success.whatNext.step1')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{t('request.success.whatNext.step2')}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{t('request.success.whatNext.step3')}</span>
          </li>
        </ul>
      </div>

      <div className="mt-6 flex gap-2">
        <Button onClick={onSubmitAnother} variant="outline" className="rounded-full px-6">
          {t('request.success.submitAnother')}
        </Button>
        <Button className="bg-primary rounded-full px-6">
          <Link to="/">{t('request.success.goHome')}</Link>
        </Button>
      </div>
    </div>
  )
}
