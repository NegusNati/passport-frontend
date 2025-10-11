import { Link } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'

import { Button } from '@/shared/ui/button'

interface AdvertisementRequestSuccessProps {
  onSubmitAnother: () => void
}

export function AdvertisementRequestSuccess({ onSubmitAnother }: AdvertisementRequestSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-6 text-center">
      <div className="bg-primary/10 text-primary rounded-full p-5">
        <CheckCircle className="h-14 w-14" />
      </div>

      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold">Request Submitted Successfully!</h2>
        <p className="text-muted-foreground max-w-md text-base">
          Thank you for your interest in advertising with us. We have received your request and our
          team will review it shortly.
        </p>
      </div>

      <div className="bg-muted/60 max-w-lg rounded-lg p-6 text-left">
        <h3 className="text-foreground mb-2 text-sm font-semibold">What happens next?</h3>
        <ul className="text-muted-foreground space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Our team will review your request within 1-2 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>We will contact you via the phone number or email you provided</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              We will discuss your advertising needs and provide you with available options
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-6 flex gap-2">
        <Button onClick={onSubmitAnother} variant="outline" className="rounded-full px-6">
          Submit Another Request
        </Button>
        <Button className="bg-primary rounded-full px-6">
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
