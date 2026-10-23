import { describe, expect, it } from 'vitest'
import { isValidGtin } from './barcode'

describe('isValidGtin', () => {
  it.each(['96385074', '036000291452', '3017624010701', '03017624010701'])(
    'accepts a valid GTIN: %s',
    (barcode) => {
      expect(isValidGtin(barcode)).toBe(true)
    },
  )

  it.each(['12345671', '123456789', '036000291453', '1234567890123', '12345678901234', '12345A74'])(
    'rejects an invalid GTIN: %s',
    (barcode) => {
      expect(isValidGtin(barcode)).toBe(false)
    },
  )

  it('ignores surrounding whitespace without accepting internal spaces', () => {
    expect(isValidGtin(' 96385074 ')).toBe(true)
    expect(isValidGtin('9638 5074')).toBe(false)
  })
})