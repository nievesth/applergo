const productFields = [
  'code',
  'product_name',
  'brands',
  'image_url',
  'ingredients_text',
  'allergens',
  'allergens_tags',
  'traces',
  'traces_tags',
] as const

interface ApiProduct {
  code?: unknown
  product_name?: unknown
  brands?: unknown
  image_url?: unknown
  ingredients_text?: unknown
  allergens?: unknown
  allergens_tags?: unknown
  traces?: unknown
  traces_tags?: unknown
}

interface ApiResult {
  id?: unknown
}

interface ApiEnvelope {
  status?: unknown
  result?: ApiResult
  product?: ApiProduct
}

export interface ProductInformation {
  barcode: string
  name?: string
  brand?: string
  imageUrl?: string
  ingredients?: string
  allergens?: ProductDeclaration
  traces?: ProductDeclaration
}

export interface ProductDeclaration {
  displayValue: string
  identifiers: string[]
  additionalLabels?: string[]
  identifiersConflict: boolean
}

export class ProductNotFoundError extends Error {
  constructor() {
    super('Product not found')
    this.name = 'ProductNotFoundError'
  }
}

export class OpenFoodFactsApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'OpenFoodFactsApiError'
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

const spanishAllergenLabels: Record<string, string> = {
  'en:celery': 'apio',
  'en:crustaceans': 'crustáceos',
  'en:eggs': 'huevos',
  'en:fish': 'pescado',
  'en:gluten': 'gluten',
  'en:hazelnuts': 'avellanas',
  'en:lupin': 'altramuces',
  'en:milk': 'leche',
  'en:molluscs': 'moluscos',
  'en:mustard': 'mostaza',
  'en:nuts': 'frutos de cáscara',
  'en:peanuts': 'cacahuetes',
  'en:sesame-seeds': 'sésamo',
  'en:soybeans': 'soja',
  'en:sulphur-dioxide-and-sulphites': 'dióxido de azufre y sulfitos',
}

function taxonomyLabel(identifier: string): string {
  return spanishAllergenLabels[identifier.toLowerCase()] ?? identifier
}

function parseTaxonomyIdentifiers(value?: string): string[] | undefined {
  if (!value) {
    return undefined
  }

  const identifiers = value.split(',').map((item) => item.trim())
  return identifiers.every((item) => /^[a-z]{2,3}:[a-z0-9-]+$/i.test(item))
    ? identifiers
    : undefined
}

function asDeclaration(value: unknown, tags: unknown): ProductDeclaration | undefined {
  const text = asString(value)
  const sourceIdentifiers = parseTaxonomyIdentifiers(text)
  const tagIdentifiers = Array.isArray(tags)
    ? tags.map(asString).filter((tag): tag is string => Boolean(tag))
    : []

  if (!text && tagIdentifiers.length === 0) {
    return undefined
  }

  const identifiers = [...new Set([...(sourceIdentifiers ?? []), ...tagIdentifiers])]
  const identifiersConflict = Boolean(
    sourceIdentifiers &&
      tagIdentifiers.length > 0 &&
      (sourceIdentifiers.length !== tagIdentifiers.length ||
        sourceIdentifiers.some(
          (identifier) =>
            !tagIdentifiers.some(
              (tagIdentifier) =>
                tagIdentifier.toLowerCase() === identifier.toLowerCase(),
            ),
        )),
  )
  const displayValue = sourceIdentifiers
    ? sourceIdentifiers.map(taxonomyLabel).join(', ')
    : text ?? tagIdentifiers.map(taxonomyLabel).join(', ')
  const shouldShowAdditionalLabels =
    tagIdentifiers.length > 0 &&
    ((!sourceIdentifiers && Boolean(text)) || identifiersConflict)

  return {
    displayValue,
    identifiers,
    additionalLabels: shouldShowAdditionalLabels
      ? tagIdentifiers.map(taxonomyLabel)
      : undefined,
    identifiersConflict,
  }
}

function parseEnvelope(value: unknown): ApiEnvelope {
  if (!isRecord(value)) {
    throw new OpenFoodFactsApiError('Invalid response from Open Food Facts')
  }

  const result = isRecord(value.result) ? value.result : undefined
  const product = isRecord(value.product) ? value.product : undefined

  return {
    status: value.status,
    result: result as ApiResult | undefined,
    product: product as ApiProduct | undefined,
  }
}

function safeImageUrl(value: unknown): string | undefined {
  const imageUrl = asString(value)

  if (!imageUrl) {
    return undefined
  }

  try {
    const parsedUrl = new URL(imageUrl)
    return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:'
      ? parsedUrl.toString()
      : undefined
  } catch {
    return undefined
  }
}

export async function fetchProductInformation(
  barcode: string,
  fetcher: typeof fetch = fetch,
): Promise<ProductInformation> {
  const endpoint = new URL(
    `https://world.openfoodfacts.org/api/v3.6/product/${encodeURIComponent(barcode)}.json`,
  )
  endpoint.searchParams.set('fields', productFields.join(','))

  const response = await fetcher(endpoint.toString(), {
    headers: { Accept: 'application/json' },
  })

  if (response.status === 404) {
    throw new ProductNotFoundError()
  }

  if (!response.ok) {
    throw new OpenFoodFactsApiError(
      `Open Food Facts returned HTTP ${response.status}`,
      response.status,
    )
  }

  let responseBody: unknown

  try {
    responseBody = await response.json()
  } catch {
    throw new OpenFoodFactsApiError('Open Food Facts returned invalid JSON')
  }

  const envelope = parseEnvelope(responseBody)

  if (envelope.result?.id === 'product_not_found') {
    throw new ProductNotFoundError()
  }

  if (envelope.status !== 'success' || envelope.result?.id !== 'product_found') {
    throw new OpenFoodFactsApiError('Open Food Facts could not return this product')
  }

  if (!envelope.product) {
    throw new OpenFoodFactsApiError('Product data is missing from the response')
  }

  return {
    barcode: asString(envelope.product.code) ?? barcode,
    name: asString(envelope.product.product_name),
    brand: asString(envelope.product.brands),
    imageUrl: safeImageUrl(envelope.product.image_url),
    ingredients: asString(envelope.product.ingredients_text),
    allergens: asDeclaration(
      envelope.product.allergens,
      envelope.product.allergens_tags,
    ),
    traces: asDeclaration(envelope.product.traces, envelope.product.traces_tags),
  }
}