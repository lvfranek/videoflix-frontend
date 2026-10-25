import type { ReactNode } from 'react'
import styles from './AuthCard.module.css'

/** Dark glass card on a blurred cinema background, used by all auth pages. */
export function AuthCard({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <h1>{title}</h1>
        {lead && <p className={styles.lead}>{lead}</p>}
        {children}
      </div>
    </section>
  )
}
