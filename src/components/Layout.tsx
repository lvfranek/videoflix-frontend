import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { useToast } from '../toast/ToastContext'
import styles from './Layout.module.css'

/** Page frame: header floats over the page content, footer with legal links. */
export function Layout({ loggedIn = false }: { loggedIn?: boolean }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const showToast = useToast()
  const onAuthPage = ['/login', '/register', '/forgot-password'].includes(pathname)

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // Cookies are gone or the server is down; either way the user ends up logged out
    }
    showToast('success', 'Du bist abgemeldet.')
    navigate('/')
  }

  return (
    <>
      <header className={styles.header}>
        <Link to={loggedIn ? '/videos' : '/'} className={styles.logo}>
          VIDEOFLIX
        </Link>
        {loggedIn ? (
          <button type="button" className={`btn btn-glass ${styles.action}`} onClick={handleLogout}>
            Abmelden
          </button>
        ) : (
          !onAuthPage && (
            <Link to="/login" className={`btn btn-brand ${styles.action}`}>
              Anmelden
            </Link>
          )
        )}
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <Link to="/imprint">Impressum</Link>
        <Link to="/privacy">Datenschutz</Link>
      </footer>
    </>
  )
}
