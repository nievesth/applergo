import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from '../features/home/HomePage'
import { ProductLookupPage } from '../features/product-lookup/ProductLookupPage'
import { SplashPage } from '../features/splash/SplashPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product-lookup" element={<ProductLookupPage />} />
        <Route path="/splash" element={<SplashPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
