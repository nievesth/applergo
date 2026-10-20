import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { OnboardingPage } from '../features/onboarding/OnboardingPage'
import { SplashPage } from '../features/splash/SplashPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/on-boarding" element={<OnboardingPage />} />
        <Route path="*" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  )
}
