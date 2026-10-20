import barcodeIllustration from '../../assets/onboarding/01-escanea-productos.webp'
import diaryIllustration from '../../assets/onboarding/02-diario-compras.webp'
import emergencyIllustration from '../../assets/onboarding/03-contacto-emergencia.webp'
import travelIllustration from '../../assets/onboarding/04-viaja-informacion.webp'
import './HomePage.css'

const features = [
  {
    title: 'Escanear productos',
    description: 'Escanea códigos de barras y consulta si un producto es apto para ti.',
    image: barcodeIllustration,
    imageAlt: 'Un teléfono escanea el código de barras de un producto alimenticio.',
  },
  {
    title: 'Mi diario',
    description: 'Registro de compras y actividades.',
    image: diaryIllustration,
    imageAlt: 'Un diario abierto muestra alimentos y actividades anotadas.',
  },
  {
    title: 'Emergencias',
    description: 'Contacto para situaciones de emergencia.',
    image: emergencyIllustration,
    imageAlt: 'Un teléfono muestra un contacto y opciones para una emergencia.',
  },
  {
    title: 'Viajes',
    description: 'Información traducida sobre alergias e intolerancias.',
    image: travelIllustration,
    imageAlt:
      'Equipaje, un pasaporte y una ficha de alergias junto a símbolos de traducción.',
  },
]

export function HomePage() {
  return (
    <main className="home-dashboard">
      <div className="home-dashboard__content">
        <header className="home-dashboard__header">
          <p className="home-dashboard__brand">APPLERGO</p>
          <h1>¿Qué necesitas hoy?</h1>
          <p className="home-dashboard__intro">
            Herramientas para tus productos, tu diario, emergencias y viajes.
          </p>
        </header>

        <section aria-labelledby="home-features-title">
          <h2 className="home-dashboard__section-title" id="home-features-title">
            Explora Applergo
          </h2>
          <div className="home-dashboard__grid">
            {features.map((feature, index) => (
              <article
                className="home-feature"
                key={feature.title}
                aria-labelledby={`home-feature-${index}`}
              >
                <figure className="home-feature__illustration">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={384}
                    height={1024}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
                <div className="home-feature__content">
                  <h3 id={`home-feature-${index}`}>{feature.title}</h3>
                  <p className="home-feature__description">
                    {feature.description}
                  </p>
                  <p className="home-feature__availability">
                    No disponible aún
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
