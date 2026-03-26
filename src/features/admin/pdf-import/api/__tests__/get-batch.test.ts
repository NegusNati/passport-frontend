import { describe, expect, it } from 'vitest'

import { getPassportImportBatchRefetchInterval } from '../get-batch'

describe('getPassportImportBatchRefetchInterval', () => {
  it('continues polling when the batch is not in a terminal state', () => {
    expect(getPassportImportBatchRefetchInterval()).toBe(2_500)
    expect(getPassportImportBatchRefetchInterval('queued')).toBe(2_500)
    expect(getPassportImportBatchRefetchInterval('processing')).toBe(2_500)
  })

  it('stops polling for completed and failed batches', () => {
    expect(getPassportImportBatchRefetchInterval('completed')).toBe(false)
    expect(getPassportImportBatchRefetchInterval('failed')).toBe(false)
  })
})
