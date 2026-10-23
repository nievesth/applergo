import { describe, expect, it, vi } from 'vitest'
import {
  fetchProductInformation,
  OpenFoodFactsApiError,
  ProductNotFoundError,
} from './openFoodFactsClient'

function response(status: number, body?: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response
}

describe('fetchProductInformation', () => {
  it('requests only the product fields used by the lookup screen', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      response(200, {
        status: 'success',
        result: { id: 'product_found' },
        product: { code: '3017624010701', product_name: 'Nutella' },
      }),
    )

    await fetchProductInformation('3017624010701', fetcher)

    const [requestUrl, requestOptions] = fetcher.mock.calls[0]
    const url = new URL(requestUrl)
    expect(url.origin).toBe('https://world.openfoodfacts.org')
    expect(url.pathname).toBe('/api/v3.6/product/3017624010701.json')
    expect(url.searchParams.get('fields')?.split(',')).toEqual([
      'code',
      'product_name',
      'brands',
      'image_url',
      'ingredients_text',
      'allergens',
      'allergens_tags',
      'traces',
      'traces_tags',
    ])
    expect(requestOptions.headers).toEqual({ Accept: 'application/json' })
  })

  it('translates known allergen taxonomy labels and preserves identifiers', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      response(200, {
        status: 'success',
        result: { id: 'product_found' },
        product: {
          code: '3017624010701',
          product_name: 'Nutella',
          brands: 'Ferrero',
          image_url: 'https://images.example.test/product.jpg',
          ingredients_text: 'Sugar, hazelnuts, milk',
          allergens: 'en:hazelnuts, en:milk',
          allergens_tags: ['en:hazelnuts', 'en:milk'],
          traces_tags: ['en:soybeans'],
        },
      }),
    )

    await expect(fetchProductInformation('3017624010701', fetcher)).resolves.toEqual({
      barcode: '3017624010701',
      name: 'Nutella',
      brand: 'Ferrero',
      imageUrl: 'https://images.example.test/product.jpg',
      ingredients: 'Sugar, hazelnuts, milk',
      allergens: {
        displayValue: 'avellanas, leche',
        identifiers: ['en:hazelnuts', 'en:milk'],
        additionalLabels: undefined,
        identifiersConflict: false,
      },
      traces: {
        displayValue: 'soja',
        identifiers: ['en:soybeans'],
        additionalLabels: undefined,
        identifiersConflict: false,
      },
    })
  })

  it('preserves unknown identifiers and reports disagreement between source and tags', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      response(200, {
        status: 'success',
        result: { id: 'product_found' },
        product: {
          allergens: 'en:milk, en:unknown-seed',
          allergens_tags: ['en:milk', 'en:peanuts'],
        },
      }),
    )

    await expect(fetchProductInformation('96385074', fetcher)).resolves.toMatchObject({
      allergens: {
        displayValue: 'leche, en:unknown-seed',
        identifiers: ['en:milk', 'en:unknown-seed', 'en:peanuts'],
        additionalLabels: ['leche', 'cacahuetes'],
        identifiersConflict: true,
      },
    })
  })

  it('preserves missing information and rejects non-http image URLs', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      response(200, {
        status: 'success',
        result: { id: 'product_found' },
        product: { image_url: 'javascript:alert(1)', allergens_tags: [] },
      }),
    )

    await expect(fetchProductInformation('96385074', fetcher)).resolves.toEqual({
      barcode: '96385074',
      name: undefined,
      brand: undefined,
      imageUrl: undefined,
      ingredients: undefined,
      allergens: undefined,
      traces: undefined,
    })
  })

  it('maps HTTP 404 and API not-found responses to a not-found error', async () => {
    const notFoundByHttp = vi.fn().mockResolvedValue(response(404))
    const notFoundByBody = vi.fn().mockResolvedValue(
      response(200, {
        status: 'failure',
        result: { id: 'product_not_found' },
      }),
    )

    await expect(
      fetchProductInformation('96385074', notFoundByHttp),
    ).rejects.toBeInstanceOf(ProductNotFoundError)
    await expect(
      fetchProductInformation('96385074', notFoundByBody),
    ).rejects.toBeInstanceOf(ProductNotFoundError)
  })

  it('reports HTTP and malformed response errors', async () => {
    const unavailable = vi.fn().mockResolvedValue(response(503))
    const invalidJson = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockRejectedValue(new SyntaxError()),
    })

    await expect(
      fetchProductInformation('96385074', unavailable),
    ).rejects.toBeInstanceOf(OpenFoodFactsApiError)
    await expect(
      fetchProductInformation('96385074', invalidJson),
    ).rejects.toThrow('invalid JSON')
  })
})