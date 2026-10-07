import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OnboardingPlaceholder } from '../features/onboarding/OnboardingPlaceholder'
import { SplashPage } from '../features/splash/SplashPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/on-boarding" element={<OnboardingPlaceholder />} />
        <Route path="*" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  )
}
