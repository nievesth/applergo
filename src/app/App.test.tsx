import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { within } from '@testing-library/react'
import { App } from './App'

beforeEach(() => {
  window.history.pushState({}, '', '/')
})

describe('Home screen', () => {
  it('opens with four clearly labeled, unavailable feature cards', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: '¿Qué necesitas hoy?' }),
    ).toBeInTheDocument()

    const features = [
      {
        title: 'Escanear productos',
        imageAlt: 'Un teléfono escanea el código de barras de un producto alimenticio.',
      },
      {
        title: 'Mi diario',
        imageAlt: 'Un diario abierto muestra alimentos y actividades anotadas.',
      },
      {
        title: 'Emergencias',
        imageAlt: 'Un teléfono muestra un contacto y opciones para una emergencia.',
      },
      {
        title: 'Viajes',
        imageAlt:
          'Equipaje, un pasaporte y una ficha de alergias junto a símbolos de traducción.',
      },
    ]

    expect(screen.getAllByRole('article')).toHaveLength(4)

    for (const feature of features) {
      const card = screen.getByRole('article', { name: feature.title })
      expect(within(card).getByRole('img', { name: feature.imageAlt })).toBeInTheDocument()
      expect(within(card).getByText('No disponible aún')).toBeInTheDocument()
      expect(within(card).queryByRole('link')).not.toBeInTheDocument()
      expect(within(card).queryByRole('button')).not.toBeInTheDocument()
    }
  })

  it('shows Home for the retired onboarding URL instead of the carousel', () => {
    window.history.pushState({}, '', '/on-boarding')

    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: '¿Qué necesitas hoy?' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Introducción' })).not.toBeInTheDocument()
  })
})

describe('Splash route', () => {
  it('provides a direct path to the Home screen', async () => {
    const user = userEvent.setup()
    window.history.pushState({}, '', '/splash')

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: /ir al inicio de applergo/i }),
    )

    expect(window.location.pathname).toBe('/')
    expect(
      screen.getByRole('heading', { level: 1, name: '¿Qué necesitas hoy?' }),
    ).toBeInTheDocument()
  })
})
