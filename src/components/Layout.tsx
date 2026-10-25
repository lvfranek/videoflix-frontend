import { Link, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

/** Page frame: header floats over the page content, footer with legal links. */
export function Layout() {
  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          VIDEOFLIX
        </Link>
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
