import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PdfUploadForm } from '../PdfUploadForm'

const LOCATION_HISTORY_STORAGE_KEY = 'admin:pdf-import:location-history'
const START_AFTER_TEXT_HISTORY_STORAGE_KEY = 'admin:pdf-import:start-after-text-history'

describe('PdfUploadForm', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('hydrates remembered values into native autocomplete suggestions', () => {
    window.localStorage.setItem(
      LOCATION_HISTORY_STORAGE_KEY,
      JSON.stringify(['Addis Ababa', 'Dire Dawa']),
    )
    window.localStorage.setItem(
      START_AFTER_TEXT_HISTORY_STORAGE_KEY,
      JSON.stringify(['REQUEST_No.', 'Application Number']),
    )

    render(<PdfUploadForm onSubmit={vi.fn()} />)

    const locationInput = screen.getByLabelText('Location')
    const startAfterTextInput = screen.getByLabelText('Start after text')

    expect(locationInput.getAttribute('autocomplete')).toBe('on')
    expect(locationInput.getAttribute('list')).toBe('pdf-import-location-history')
    expect(startAfterTextInput.getAttribute('autocomplete')).toBe('on')
    expect(startAfterTextInput.getAttribute('list')).toBe('pdf-import-start-after-text-history')

    const locationOptions = document.querySelectorAll(
      '#pdf-import-location-history option',
    ) as NodeListOf<HTMLOptionElement>
    const startAfterTextOptions = document.querySelectorAll(
      '#pdf-import-start-after-text-history option',
    ) as NodeListOf<HTMLOptionElement>

    expect(Array.from(locationOptions).map((option) => option.value)).toEqual([
      'Addis Ababa',
      'Dire Dawa',
    ])
    expect(Array.from(startAfterTextOptions).map((option) => option.value)).toEqual([
      'REQUEST_No.',
      'Application Number',
    ])
  })

  it('stores trimmed field values after a successful upload', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)

    render(<PdfUploadForm onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('PDF file'), {
      target: {
        files: [new File(['pdf'], 'batch.pdf', { type: 'application/pdf' })],
      },
    })
    fireEvent.change(screen.getByLabelText('Date (YYYY-MM-DD)'), {
      target: { value: '2026-03-29' },
    })
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: '  Addis Ababa  ' },
    })
    fireEvent.change(screen.getByLabelText('Start after text'), {
      target: { value: '  Application Number  ' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Upload & Queue Batch' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          location: 'Addis Ababa',
          start_after_text: 'Application Number',
        }),
      )
    })

    expect(JSON.parse(window.localStorage.getItem(LOCATION_HISTORY_STORAGE_KEY) ?? '[]')).toEqual([
      'Addis Ababa',
    ])
    expect(
      JSON.parse(window.localStorage.getItem(START_AFTER_TEXT_HISTORY_STORAGE_KEY) ?? '[]'),
    ).toEqual(['Application Number'])
  })
})
