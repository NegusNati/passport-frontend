import * as React from 'react'
import { useRouter } from '@tanstack/react-router'
import { PassportDetailCard } from './PassportDetailCard'
import { PassportsTable } from './PassportsTable'
import { AdSlot } from '@/shared/ui/ad-slot'
import { DUMMY_PASSPORTS } from '../lib/dummy-data'

interface PassportDetailPageProps {
  passportId?: string
  requestNumber?: string
}

export function PassportDetailPage({ passportId, requestNumber }: PassportDetailPageProps) {
  const router = useRouter()

  // Find the passport by ID or request number
  const passport = React.useMemo(() => {
    console.log('PassportDetailPage received:', { passportId, requestNumber })
    console.log('DUMMY_PASSPORTS:', DUMMY_PASSPORTS.map(p => ({ id: p.id, name: p.name, requestNumber: p.requestNumber })))
    
    if (passportId) {
      const found = DUMMY_PASSPORTS.find(p => p.id === passportId)
      console.log('Found by ID:', found)
      return found
    } else if (requestNumber) {
      const found = DUMMY_PASSPORTS.find(p => p.requestNumber === requestNumber)
      console.log('Found by request number:', found)
      return found
    }
    console.log('No passport found')
    return null
  }, [passportId, requestNumber])

  const handleCheckAnother = React.useCallback(() => {
    router.navigate({ to: '/passports' })
  }, [router])

  // If no passport found, redirect to main page or show error
  if (!passport) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-foreground">Passport Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The requested passport could not be found. Please check the request number and try again.
        </p>
        <button
          onClick={handleCheckAnother}
          className="mt-6 rounded-md bg-primary px-6 py-2 text-primary-foreground hover:opacity-90"
        >
          Back to Search
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Passport Detail Card */}
      <PassportDetailCard 
        passport={passport} 
        onCheckAnother={handleCheckAnother}
      />
      
      {/* Ad Banner Section */}
      <section className="bg-background py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <AdSlot 
            preset="sponsored" 
            orientation="horizontal"
            className="rounded-lg"
          />
        </div>
      </section>
      
      {/* Latest Passports Table Section */}
      <PassportsTable />
    </div>
  )
}
