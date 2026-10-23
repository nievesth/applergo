const supportedGtinLengths = new Set([8, 12, 13, 14])

export function isValidGtin(value: string): boolean {
  const barcode = value.trim()

  if (!/^\d+$/.test(barcode) || !supportedGtinLengths.has(barcode.length)) {
    return false
  }

  const digits = [...barcode].map(Number)
  const checkDigit = digits.pop()

  if (checkDigit === undefined) {
    return false
  }

  let sum = 0
  let weight = 3

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    sum += digits[index] * weight
    weight = weight === 3 ? 1 : 3
  }

  return (10 - (sum % 10)) % 10 === checkDigit
}