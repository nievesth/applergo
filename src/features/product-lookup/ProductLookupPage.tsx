import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchProductInformation,
  OpenFoodFactsApiError,
  ProductNotFoundError,
  type ProductDeclaration,
  type ProductInformation,
} from './openFoodFactsClient'
import { isValidGtin } from './barcode'
import './ProductLookupPage.css'

type LookupState =
  | { type: 'idle' }
  | { type: 'empty' }
  | { type: 'invalid' }
  | { type: 'loading' }
  | { type: 'not-found' }
  | { type: 'network-error' }
  | { type: 'api-error' }
  | { type: 'success'; product: ProductInformation }

const missingValue = 'No disponible en los datos consultados.'

function ProductField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="product-field">
      <dt>{label}</dt>
      <dd>{value ?? missingValue}</dd>
    </div>
  )
}

function DeclarationField({
  label,
  declaration,
  missingMessage,
}: {
  label: string
  declaration?: ProductDeclaration
  missingMessage: string
}) {
  return (
    <div className="product-field product-field--declaration">
      <dt>{label}</dt>
      <dd>{declaration?.displayValue ?? missingMessage}</dd>
      {declaration?.additionalLabels && (
        <p className="product-field__taxonomy">
          Etiquetas de Open Food Facts: {declaration.additionalLabels.join(', ')}
        </p>
      )}
      {declaration?.identifiersConflict && (
        <p className="product-field__inconsistency">
          El texto declarado y las etiquetas del catálogo no coinciden. Comprueba el envase.
        </p>
      )}
    </div>
  )
}

function ProductResult({ product }: { product: ProductInformation }) {
  return (
    <section
      className="product-lookup__result"
      aria-labelledby="product-result-title"
      aria-live="polite"
    >
      <div className="product-lookup__overview">
        <header className="product-lookup__result-header">
          <p className="product-lookup__eyebrow">Datos de Open Food Facts</p>
          <h2 id="product-result-title">
            {product.name ?? 'Nombre no disponible'}
          </h2>
          <p className="product-lookup__brand">
            {product.brand ?? 'Marca no disponible en los datos consultados.'}
          </p>
        </header>

        {product.imageUrl ? (
          <figure className="product-lookup__image">
            <img
              src={product.imageUrl}
              alt={`Imagen del producto ${product.name ?? product.barcode}`}
              loading="lazy"
              decoding="async"
            />
          </figure>
        ) : (
          <p className="product-lookup__missing-image">Imagen no disponible en los datos consultados.</p>
        )}
      </div>

      <section
        className="product-lookup__declarations"
        aria-labelledby="product-declarations-title"
      >
        <h3 id="product-declarations-title">Alérgenos y trazas declarados</h3>
        <dl className="product-lookup__declaration-list">
          <DeclarationField
            label="Alérgenos declarados"
            declaration={product.allergens}
            missingMessage="Sin información de alérgenos en los datos consultados. Esto no confirma ausencia de alérgenos."
          />
          <DeclarationField
            label="Trazas precautorias"
            declaration={product.traces}
            missingMessage="Sin información de trazas en los datos consultados. Esto no confirma ausencia de trazas."
          />
        </dl>
      </section>

      <section
        className="product-lookup__secondary"
        aria-labelledby="product-secondary-title"
      >
        <h3 id="product-secondary-title">Otros datos del producto</h3>
        <dl className="product-lookup__details">
          <ProductField label="Ingredientes declarados" value={product.ingredients} />
          <ProductField label="Código de barras" value={product.barcode} />
        </dl>
      </section>
    </section>
  )
}

export function ProductLookupPage() {
  const [barcode, setBarcode] = useState('')
  const [state, setState] = useState<LookupState>({ type: 'idle' })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedBarcode = barcode.trim()

    if (!normalizedBarcode) {
      setState({ type: 'empty' })
      return
    }

    if (!isValidGtin(normalizedBarcode)) {
      setState({ type: 'invalid' })
      return
    }

    setState({ type: 'loading' })

    try {
      const product = await fetchProductInformation(normalizedBarcode)
      setState({ type: 'success', product })
    } catch (error) {
      if (error instanceof ProductNotFoundError) {
        setState({ type: 'not-found' })
      } else if (error instanceof OpenFoodFactsApiError) {
        setState({ type: 'api-error' })
      } else {
        setState({ type: 'network-error' })
      }
    }
  }

  return (
    <main className="product-lookup">
      <div className="product-lookup__content">
        <Link className="product-lookup__back" to="/">
          Volver al inicio
        </Link>

        <header className="product-lookup__header">
          <p className="product-lookup__eyebrow">PRODUCTOS</p>
          <h1>Buscar producto</h1>
          <p>
            Introduce el código de barras para consultar la información disponible.
          </p>
        </header>

        <aside className="product-lookup__disclaimer" aria-label="Aviso importante">
          <strong>Comprueba siempre el envase físico.</strong> La información puede
          estar incompleta o desactualizada. Si tienes alergias, verifica los
          ingredientes y las advertencias del producto. La falta de datos no
          significa que sea seguro o adecuado para ti.
        </aside>

        <form
          className="product-lookup__form"
          onSubmit={handleSubmit}
          aria-busy={state.type === 'loading'}
        >
          <label htmlFor="product-barcode">Código de barras</label>
          <div className="product-lookup__form-controls">
            <input
              id="product-barcode"
              name="barcode"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={14}
              value={barcode}
              onChange={(event) => {
                setBarcode(event.target.value)
                setState({ type: 'idle' })
              }}
              aria-invalid={state.type === 'invalid'}
              aria-describedby="barcode-help barcode-feedback"
            />
            <button type="submit" disabled={state.type === 'loading'}>
              {state.type === 'loading' ? 'Buscando…' : 'Buscar producto'}
            </button>
          </div>
          <p className="product-lookup__help" id="barcode-help">
            GTIN-8, GTIN-12, GTIN-13 o GTIN-14, incluido el dígito de control.
          </p>
          <div
            className="product-lookup__feedback"
            id="barcode-feedback"
            role={state.type === 'invalid' ? 'alert' : 'status'}
            aria-live="polite"
          >
            {state.type === 'empty' && 'Introduce un código de barras.'}
            {state.type === 'invalid' &&
              'Revisa el código: debe tener 8, 12, 13 o 14 dígitos y un dígito de control válido.'}
          </div>
        </form>

        <div
          className="product-lookup__response"
          aria-live="polite"
          aria-busy={state.type === 'loading'}
        >
          {state.type === 'idle' && (
            <p>La información disponible aparecerá aquí.</p>
          )}
          {state.type === 'loading' && <p role="status">Consultando producto…</p>}
          {state.type === 'not-found' && (
            <p role="status">
              No encontramos ese código en Open Food Facts. Comprueba el número o
              vuelve a intentarlo más tarde.
            </p>
          )}
          {state.type === 'network-error' && (
            <p role="alert">
              No se pudo conectar con Open Food Facts. Comprueba tu conexión e
              inténtalo de nuevo.
            </p>
          )}
          {state.type === 'api-error' && (
            <p role="alert">
              Open Food Facts no pudo completar la consulta. Inténtalo de nuevo
              más tarde.
            </p>
          )}
          {state.type === 'success' && <ProductResult product={state.product} />}
        </div>
      </div>
    </main>
  )
}