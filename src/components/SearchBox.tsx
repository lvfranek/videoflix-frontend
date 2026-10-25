import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { CloseIcon, SearchIcon } from './icons'
import styles from './SearchBox.module.css'

/** Search icon in the header that opens into a field; the text lives in the URL (?q=). */
export function SearchBox() {
  const [params, setParams] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const query = pathname === '/videos' ? (params.get('q') ?? '') : ''
  const [open, setOpen] = useState(Boolean(query))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function update(value: string) {
    if (pathname === '/videos') {
      setParams(value ? { q: value } : {}, { replace: true })
    } else {
      navigate({ pathname: '/videos', search: value ? `?q=${encodeURIComponent(value)}` : '' })
    }
  }

  function close() {
    update('')
    setOpen(false)
  }

  if (!open) {
    return (
      <button type="button" className={styles.toggle} onClick={() => setOpen(true)} aria-label="Suchen">
        <SearchIcon size={22} />
      </button>
    )
  }

  return (
    <div className={styles.box} role="search">
      <SearchIcon size={18} />
      <label htmlFor="search" className={styles.srOnly}>
        Videos suchen
      </label>
      <input
        ref={inputRef}
        id="search"
        type="search"
        placeholder="Titel, Kategorie..."
        value={query}
        onChange={(event) => update(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') close()
        }}
        onBlur={() => {
          if (!query) setOpen(false)
        }}
      />
      {query && (
        <button type="button" className={styles.clear} onClick={close} aria-label="Suche leeren">
          <CloseIcon size={18} />
        </button>
      )}
    </div>
  )
}
