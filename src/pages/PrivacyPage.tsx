import { Link } from 'react-router-dom'
import styles from './Legal.module.css'

export function PrivacyPage() {
  return (
    <article className={styles.page}>
      <h1>Datenschutz</h1>

      <h2>1. Verantwortlicher</h2>
      <p>
        Franciszek Kaminski, Eppenhainerstraße 19, 28307 Bremen, Deutschland
        <br />
        E-Mail: <a href="mailto:info@franekkaminski.dev">info@franekkaminski.dev</a>
        <br />
        Weitere Angaben findest du im <Link to="/imprint">Impressum</Link>.
      </p>

      <h2>2. Welche Daten verarbeitet werden</h2>
      <h3>Benutzerkonto</h3>
      <p>
        Bei der Registrierung speichere ich deine <strong>E-Mail-Adresse</strong> und dein{' '}
        <strong>Passwort</strong> (nur verschlüsselt als Hash). Diese Daten brauche ich, damit du
        dich anmelden und Videos ansehen kannst (Art. 6 Abs. 1 lit. b DSGVO).
      </p>

      <h3>E-Mails</h3>
      <p>
        Für die Aktivierung deines Kontos und zum Zurücksetzen des Passworts bekommst du E-Mails.
        Dafür wird deine E-Mail-Adresse an den Versanddienst übermittelt (siehe Punkt 3). Werbung
        verschicke ich nicht.
      </p>

      <h3>Cookies</h3>
      <p>
        Für die Anmeldung setzt die Anwendung zwei technisch notwendige Cookies:{' '}
        <strong>access_token</strong> (gültig 30 Minuten) und <strong>refresh_token</strong> (gültig
        1 Tag). Sie halten dich eingeloggt und werden beim Abmelden gelöscht. Es gibt keine
        Tracking- oder Werbe-Cookies. Rechtsgrundlage ist § 25 Abs. 2 Nr. 2 TDDDG.
      </p>

      <h3>Server-Logfiles</h3>
      <p>
        Beim Aufruf der Seite und beim Abspielen von Videos werden technisch notwendige Daten wie
        IP-Adresse, Zeitpunkt und aufgerufene Adresse kurzzeitig in Server-Logs gespeichert, um den
        sicheren Betrieb zu gewährleisten (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>3. Hosting und Dienste</h2>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> (USA) stellt die Website bereit. Dabei werden technische
          Zugriffsdaten verarbeitet. Die Übermittlung in die USA erfolgt auf Grundlage des EU-US
          Data Privacy Framework bzw. von Standardvertragsklauseln.
        </li>
        <li>
          <strong>Contabo GmbH</strong> (Deutschland) betreibt den Server, auf dem die Datenbank mit
          den Kontodaten und die Videos liegen.
        </li>
        <li>
          <strong>Google Gmail</strong> (Google Ireland Ltd.) verschickt die Aktivierungs- und
          Passwort-E-Mails.
        </li>
      </ul>
      <p>Schriftarten werden von diesem Server geladen, nicht von Google.</p>

      <h2>4. Speicherdauer</h2>
      <p>
        Deine Daten bleiben gespeichert, solange dein Konto besteht. Für die Löschung deines Kontos
        genügt eine E-Mail an mich.
      </p>

      <h2>5. Deine Rechte</h2>
      <p>
        Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
        Datenübertragbarkeit und Widerspruch (Art. 15 bis 21 DSGVO). Außerdem kannst du dich bei
        einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für
        Datenschutz und Informationsfreiheit der Freien Hansestadt Bremen.
      </p>

      <p className={styles.updated}>Stand: Oktober 2026</p>
    </article>
  )
}
