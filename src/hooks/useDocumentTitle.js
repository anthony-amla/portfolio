import { useEffect } from 'react'

/** Sets `document.title` while the calling page is mounted. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
  }, [title])
}
