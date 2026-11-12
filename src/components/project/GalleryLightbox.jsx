import { useEffect, useRef } from 'react'
import Icon from '../icons/Icon'
import { useI18n } from '../../i18n/context'

/**
 * Full-screen view of the gallery item at `index`, in a native modal <dialog>.
 * Arrow keys and the side buttons step through the items; Esc, the close
 * button or a click outside the image close it.
 *
 * @param {object} props
 * @param {{ type: 'image' | 'video', src: string, poster?: string, caption?: any }[]} props.items
 * @param {number} props.index
 * @param {(delta: number) => void} props.onStep
 * @param {() => void} props.onClose
 * @param {string} props.title
 */
export default function GalleryLightbox({ items, index, onStep, onClose, title }) {
  const { t, l } = useI18n()
  const dialogRef = useRef(null)
  const current = items[index]
  const caption = l(current.caption)
  const many = items.length > 1

  // close() gives focus back to the image that opened it; onClose unmounts.
  const close = () => {
    dialogRef.current?.close()
    onClose()
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    document.documentElement.classList.add('modal-open')
    return () => document.documentElement.classList.remove('modal-open')
  }, [])

  function handleKeyDown(event) {
    if (!many) return
    if (event.key === 'ArrowLeft') onStep(-1)
    if (event.key === 'ArrowRight') onStep(1)
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={caption || title}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => event.target === event.currentTarget && close()}
      onKeyDown={handleKeyDown}
    >
      <button type="button" className="px-icon-btn lightbox-close" onClick={close} aria-label={t('common.close')}>
        <Icon name="close" size={18} />
      </button>

      <figure className="lightbox-figure">
        {current.type === 'video' ? (
          <video
            key={current.src}
            className="lightbox-media"
            src={current.src}
            poster={current.poster}
            controls
            playsInline
          />
        ) : (
          <img key={current.src} className="lightbox-media" src={current.src} alt={caption || title} />
        )}
        <figcaption className="lightbox-caption">
          {caption && <span>{caption}</span>}
          {many && (
            <span className="gallery-counter">
              {index + 1}/{items.length}
            </span>
          )}
        </figcaption>
      </figure>

      {many && (
        <>
          <button
            type="button"
            className="px-icon-btn lightbox-nav lightbox-prev"
            onClick={() => onStep(-1)}
            aria-label={t('common.previousImage')}
          >
            <Icon name="chevronLeft" size={22} />
          </button>
          <button
            type="button"
            className="px-icon-btn lightbox-nav lightbox-next"
            onClick={() => onStep(1)}
            aria-label={t('common.nextImage')}
          >
            <Icon name="chevronRight" size={22} />
          </button>
        </>
      )}
    </dialog>
  )
}
