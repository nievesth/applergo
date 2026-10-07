import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('Splash milestone', () => {
  it('renders the splash screen with Applergic branding', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /applergic/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: /applergic logo/i }),
    ).toBeInTheDocument()
  })

  it('navigates to /on-boarding when the splash is activated', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', { name: /entrar a applergic/i }),
    )

    expect(window.location.pathname).toBe('/on-boarding')
  })
})
