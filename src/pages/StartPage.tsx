import styles from './StartPage.module.css'

// First version of the start page; login and registration come in the next step
export function StartPage() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1>Filme und Dokus. Jederzeit.</h1>
        <p>Streame alle Videos in 480p, 720p oder 1080p, passend zu deiner Verbindung.</p>
      </div>
    </section>
  )
}
