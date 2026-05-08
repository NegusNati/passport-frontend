import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PublicAdvertisementResponse } from '@/features/advertisements/schemas/public-advertisement'
import { DynamicAdSlot } from '@/shared/ui/ad-slot'

const mocks = vi.hoisted(() => ({
  handleClick: vi.fn(),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock('@/features/advertisements/api/get-ad', () => ({
  useAdQuery: () => ({ data: null, isLoading: false }),
}))

vi.mock('@/features/advertisements/hooks/useAdTracking', () => ({
  useAdTracking: () => ({
    handleClick: mocks.handleClick,
    impressionRef: vi.fn(),
  }),
}))

const adPayload = {
  id: 42,
  slot_code: 'home-alerts-banner',
  title: 'Passport Alerts',
  alt_text: 'Passport Alerts promotion',
  target_url: 'https://passport.et/alerts',
  desktop_asset: {
    url: 'https://passport.et/storage/desktop.webp',
    width: 1200,
    height: 300,
  },
  mobile_asset: {
    url: 'https://passport.et/storage/mobile.webp',
    width: 640,
    height: 360,
  },
  impression_url: '/api/v1/advertisements/42/impression',
  click_url: '/api/v1/advertisements/42/click',
}

describe('dynamic ad slot', () => {
  it('parses public advertisement responses into renderable asset URLs', () => {
    const parsed = PublicAdvertisementResponse.parse({ data: adPayload })

    expect(parsed.data?.slot_code).toBe('home-alerts-banner')
    expect(parsed.data?.desktop_asset_url).toBe('https://passport.et/storage/desktop.webp')
    expect(parsed.data?.mobile_asset_url).toBe('https://passport.et/storage/mobile.webp')
    expect(parsed.data?.target_url).toBe('https://passport.et/alerts')
  })

  it('renders a linked picture with desktop and mobile creatives', () => {
    const parsed = PublicAdvertisementResponse.parse({ data: adPayload })
    render(<DynamicAdSlot code="home-alerts-banner" ad={parsed.data} />)

    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('https://passport.et/alerts')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('sponsored')

    const image = screen.getByRole('img', { name: 'Passport Alerts promotion' })
    expect(image.getAttribute('src')).toBe('https://passport.et/storage/desktop.webp')
    expect(image.getAttribute('width')).toBe('1200')
    expect(image.getAttribute('height')).toBe('300')

    const mobileSource = link.querySelector('source[media="(max-width: 767px)"]')
    expect(mobileSource?.getAttribute('srcset')).toBe('https://passport.et/storage/mobile.webp')

    fireEvent.click(link)
    expect(mocks.handleClick).toHaveBeenCalledTimes(1)
  })
})
