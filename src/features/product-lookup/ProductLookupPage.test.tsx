import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProductLookupPage } from './ProductLookupPage'

function productResponse(product: Record<string, unknown>) {
  return {
    ok: true,
    status: 200,
    json: vi.fn().mockResolvedValue({
      status: 'success',
      result: { id: 'product_found' },
      product,
    }),
  }
}

function renderLookup() {
  return render(
    <MemoryRouter initialEntries={['/product-lookup']}>
      <ProductLookupPage />
    </MemoryRouter>,
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ProductLookupPage', () => {
  it('shows the empty and invalid barcode states without making a request', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderLookup()

    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))
    expect(screen.getByText('Introduce un código de barras.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Código de barras'), '12345671')
    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))

    expect(screen.getByRole('alert')).toHaveTextContent('dígito de control válido')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows loading and then the successful product information', async () => {
    const user = userEvent.setup()
    let resolveResponse!: (value: unknown) => void
    const fetchMock = vi.fn().mockImplementation(
      () => new Promise((resolve) => { resolveResponse = resolve }),
    )
    vi.stubGlobal('fetch', fetchMock)
    renderLookup()

    await user.type(screen.getByLabelText('Código de barras'), '3017624010701')
    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))

    expect(screen.getByText('Consultando producto…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Buscando…' })).toBeDisabled()

    resolveResponse(
      productResponse({
        code: '3017624010701',
        product_name: 'Nutella',
        brands: 'Ferrero',
        image_url: 'https://images.example.test/nutella.jpg',
        ingredients_text: 'Sugar, hazelnuts, milk',
        allergens: 'en:hazelnuts, en:milk',
        traces: 'en:soybeans',
      }),
    )

    expect(await screen.findByRole('heading', { name: 'Nutella' })).toBeInTheDocument()
    expect(screen.getByText('Ferrero')).toBeInTheDocument()
    expect(screen.getByText('Sugar, hazelnuts, milk')).toBeInTheDocument()
    expect(screen.getByText('avellanas, leche')).toBeInTheDocument()
    expect(screen.getByText('soja')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Alérgenos y trazas declarados' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Otros datos del producto' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Imagen del producto Nutella' })).toHaveAttribute(
      'src',
      'https://images.example.test/nutella.jpg',
    )
    expect(screen.getByText(/La información puede estar incompleta o desactualizada/)).toBeInTheDocument()
  })

  it('labels unavailable fields and does not imply allergen safety', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(productResponse({ code: '3017624010701' })))
    renderLookup()

    await user.type(screen.getByLabelText('Código de barras'), '3017624010701')
    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))

    expect(await screen.findByText('Nombre no disponible')).toBeInTheDocument()
    expect(screen.getByText('Marca no disponible en los datos consultados.')).toBeInTheDocument()
    expect(screen.getByText('No disponible en los datos consultados.')).toBeInTheDocument()
    expect(screen.getByText(/Esto no confirma ausencia de alérgenos/)).toBeInTheDocument()
    expect(screen.getByText(/Esto no confirma ausencia de trazas/)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: /seguro|apto para ti|compatible/i }),
    ).not.toBeInTheDocument()
  })

  it('shows source and taxonomy disagreement without silently reconciling it', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        productResponse({
          code: '3017624010701',
          allergens: 'en:milk',
          allergens_tags: ['en:peanuts'],
        }),
      ),
    )
    renderLookup()

    await user.type(screen.getByLabelText('Código de barras'), '3017624010701')
    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))

    expect(await screen.findByText('leche')).toBeInTheDocument()
    expect(
      screen.getByText('Etiquetas de Open Food Facts: cacahuetes'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/El texto declarado y las etiquetas del catálogo no coinciden/),
    ).toBeInTheDocument()
  })

  it('shows not-found, network-error and API-error states', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValueOnce({ ok: false, status: 404 })
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce({ ok: false, status: 503 })
    vi.stubGlobal('fetch', fetchMock)
    renderLookup()

    await user.type(screen.getByLabelText('Código de barras'), '3017624010701')
    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))
    expect(await screen.findByText(/No encontramos ese código/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo conectar')

    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Open Food Facts no pudo completar')
  })

  it('clears a prior product when the barcode input changes', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        productResponse({ code: '3017624010701', product_name: 'Nutella' }),
      ),
    )
    renderLookup()

    const input = screen.getByLabelText('Código de barras')
    await user.type(input, '3017624010701')
    await user.click(screen.getByRole('button', { name: 'Buscar producto' }))
    expect(await screen.findByRole('heading', { name: 'Nutella' })).toBeInTheDocument()

    await user.type(input, '0')
    expect(screen.queryByRole('heading', { name: 'Nutella' })).not.toBeInTheDocument()
    expect(screen.getByText('La información disponible aparecerá aquí.')).toBeInTheDocument()
  })

  it('navigates back to Home', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/product-lookup']}>
        <Routes>
          <Route path="/product-lookup" element={<ProductLookupPage />} />
          <Route path="/" element={<h1>Inicio de Applergo</h1>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: 'Volver al inicio' }))

    expect(
      await screen.findByRole('heading', { name: 'Inicio de Applergo' }),
    ).toBeInTheDocument()
  })
})
