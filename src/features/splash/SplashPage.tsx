import { useNavigate } from 'react-router-dom'
import './SplashPage.css'

export function SplashPage() {
  const navigate = useNavigate()

  return (
    <main className="splash-page">
      <button
        type="button"
        className="splash-page__button"
        onClick={() => navigate('/on-boarding')}
        aria-label="Entrar a Applergic"
      >
        <div className="splash-page__content">
          <h1 className="splash-page__title">Applergic</h1>

          <div
            role="img"
            aria-label="Applergic logo"
            className="splash-page__mark"
          >
            <span aria-hidden="true">A</span>
          </div>
        </div>
      </button>
    </main>
  )
}
