import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from '../features/home/HomePage'
import { SplashPage } from '../features/splash/SplashPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/splash" element={<SplashPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
