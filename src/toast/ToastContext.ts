import { createContext, useContext } from 'react'

export type ToastKind = 'success' | 'error'

export type ShowToast = (kind: ToastKind, message: string) => void

export const ToastContext = createContext<ShowToast | null>(null)

export function useToast() {
  const showToast = useContext(ToastContext)
  if (!showToast) throw new Error('useToast must be used inside <ToastProvider>')
  return showToast
}
