import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'
import { OnboardingPage } from '../features/onboarding/OnboardingPage'

describe('Splash milestone', () => {
  it('renders the splash screen with Applergo branding', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /applergo/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /applergo logo/i }),
    ).toBeInTheDocument()
  })

  it('navigates to /on-boarding when the splash is activated', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: /entrar a applergo/i }),
    )

    expect(window.location.pathname).toBe('/on-boarding')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Introducción' }),
    ).toBeInTheDocument()
  })
})

describe('Onboarding flow', () => {
  it('renders all four evidenced topics as the user advances', async () => {
    const user = userEvent.setup()

    render(<OnboardingPage />)

    const topics = [
      {
        title: 'Escanea tus productos',
        description:
          '¡Bienvenido a Applergo! Escanea el código de barras de tu producto y Applergo te dirá si es apto para ti',
      },
      {
        title: 'Diario de compras y actividades',
        description: 'Lleva tu Diario de compras y actividades',
      },
      {
        title: 'Contacto en caso de emergencia',
        description:
          'En caso de emergencia nos pondremos en contacto con la persona que nos digas.',
      },
      {
        title: 'Viaja con información',
        description:
          'Viaja a donde quieras. Tendrás a tu disposición un traductor off-line y tu informe de alergias e intolerancias traducidos al idioma local',
      },
    ]

    for (const [index, topic] of topics.entries()) {
      expect(
        screen.getByRole('heading', { level: 2, name: topic.title }),
      ).toBeInTheDocument()
      expect(screen.getByText(topic.description)).toBeInTheDocument()

      if (index < topics.length - 1) {
        await user.click(screen.getByRole('button', { name: 'Siguiente' }))
      }
    }
  })

  it('keeps navigation within the first and last slide', async () => {
    const user = userEvent.setup()

    render(<OnboardingPage />)

    const previousButton = screen.getByRole('button', { name: 'Anterior' })
    expect(previousButton).toBeDisabled()
    expect(screen.queryByRole('button', { name: 'Terminar' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Saltar' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Siguiente' }))
    expect(previousButton).toBeEnabled()

    await user.click(previousButton)
    expect(
      screen.getByRole('heading', { level: 2, name: 'Escanea tus productos' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Siguiente' }))
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))
    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(
      screen.getByRole('heading', { level: 2, name: 'Viaja con información' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled()
  })

  it('updates the accessible progress indicator with the current slide', async () => {
    const user = userEvent.setup()

    render(<OnboardingPage />)

    const progress = screen.getByRole('progressbar', {
      name: 'Progreso de la introducción',
    })
    expect(progress).toHaveAttribute('aria-valuenow', '1')
    expect(progress).toHaveAttribute('aria-valuetext', 'Paso 1 de 4')
    expect(screen.getByText('Paso 1 de 4')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Siguiente' }))

    expect(progress).toHaveAttribute('aria-valuenow', '2')
    expect(progress).toHaveAttribute('aria-valuetext', 'Paso 2 de 4')
    expect(screen.getByText('Paso 2 de 4')).toBeInTheDocument()
  })
})
