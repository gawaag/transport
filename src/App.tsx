import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteProvider } from './context/SiteContext'
import { Admin } from './pages/Admin'
import { Home } from './pages/Home'

export const ADMIN_PATH = '/console-lx91'

export default function App() {
  return (
    <SiteProvider>
      <div className="lx-grain" aria-hidden="true" />
      <BrowserRouter>
        <Routes>
          <Route path={ADMIN_PATH} element={<Admin />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SiteProvider>
  )
}
