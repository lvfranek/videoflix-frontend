import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ActivatePage } from './pages/ActivatePage'
import { ConfirmPasswordPage } from './pages/ConfirmPasswordPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { StartPage } from './pages/StartPage'
import { ToastProvider } from './toast/ToastProvider'

// Loaded only after login, it brings the large HLS player library with it
const VideosPage = lazy(() => import('./pages/VideosPage').then((m) => ({ default: m.VideosPage })))

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            {/* These two paths are fixed by the links in the backend's emails */}
            <Route path="/pages/auth/activate.html" element={<ActivatePage />} />
            <Route path="/pages/auth/confirm_password.html" element={<ConfirmPasswordPage />} />
          </Route>
          <Route element={<Layout loggedIn />}>
            <Route
              path="/videos"
              element={
                <Suspense fallback={null}>
                  <VideosPage />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
