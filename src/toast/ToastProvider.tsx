import { useCallback, useState, type ReactNode } from 'react'
import { ToastContext, type ToastKind } from './ToastContext'
import styles from './Toast.module.css'

type Toast = { id: number; kind: ToastKind; message: string }

const DURATION_MS = 3500
let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((kind: ToastKind, message: string) => {
    const id = nextId++
    setToasts((current) => [...current, { id, kind, message }])
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, DURATION_MS)
  }, [])

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={styles.stack} role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={styles.toast}>
            <span className={toast.kind === 'error' ? styles.labelError : styles.labelSuccess}>
              {toast.kind === 'error' ? 'Fehler' : 'Erledigt'}
            </span>
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
