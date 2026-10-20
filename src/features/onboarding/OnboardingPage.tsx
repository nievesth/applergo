import { useState } from 'react'
import './OnboardingPage.css'

const slides = [
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

export function OnboardingPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const currentSlide = slides[currentSlideIndex]
  const currentStep = currentSlideIndex + 1

  return (
    <main className="onboarding-page">
      <div className="onboarding-page__content">
        <header className="onboarding-page__header">
          <p className="onboarding-page__eyebrow">APPLERGO</p>
          <h1>Introducción</h1>
        </header>

        <div className="onboarding-page__progress">
          <p
            className="onboarding-page__step"
            aria-live="polite"
            aria-atomic="true"
          >
            Paso {currentStep} de {slides.length}
          </p>
          <div
            className="onboarding-page__progress-track"
            role="progressbar"
            aria-label="Progreso de la introducción"
            aria-valuemin={1}
            aria-valuemax={slides.length}
            aria-valuenow={currentStep}
            aria-valuetext={`Paso ${currentStep} de ${slides.length}`}
          >
            <span
              className="onboarding-page__progress-value"
              style={{ width: `${(currentStep / slides.length) * 100}%` }}
            />
          </div>
        </div>

        <section
          className="onboarding-page__slide"
          aria-labelledby="onboarding-slide-title"
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 id="onboarding-slide-title">{currentSlide.title}</h2>
          <p>{currentSlide.description}</p>
        </section>

        <nav
          className="onboarding-page__navigation"
          aria-label="Navegación de la introducción"
        >
          <button
            className="onboarding-page__button onboarding-page__button--previous"
            type="button"
            onClick={() => setCurrentSlideIndex((index) => index - 1)}
            disabled={currentSlideIndex === 0}
          >
            Anterior
          </button>
          <button
            className="onboarding-page__button onboarding-page__button--next"
            type="button"
            onClick={() => setCurrentSlideIndex((index) => index + 1)}
            disabled={currentSlideIndex === slides.length - 1}
          >
            Siguiente
          </button>
        </nav>
      </div>
    </main>
  )
}

