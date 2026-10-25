import styles from './Legal.module.css'

export function ImprintPage() {
  return (
    <article className={styles.page}>
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Franciszek Kaminski
        <br />
        Eppenhainerstraße 19
        <br />
        28307 Bremen
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href="mailto:info@franekkaminski.dev">info@franekkaminski.dev</a>
      </p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>Franciszek Kaminski, Anschrift wie oben.</p>

      <h2>Über dieses Projekt</h2>
      <p>
        Videoflix ist ein nicht-kommerzielles Portfolio-Projekt. Es dient nur zu Lern- und
        Bewerbungszwecken.
      </p>

      <h2>Haftung für Inhalte</h2>
      <p>
        Als Diensteanbieter bin ich für eigene Inhalte auf diesen Seiten nach den allgemeinen
        Gesetzen verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die von mir erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
        Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
      </p>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </article>
  )
}
