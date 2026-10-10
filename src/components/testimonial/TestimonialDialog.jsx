import { useEffect, useRef } from 'react'
import Icon from '../icons/Icon'
import PixelStars from '../icons/PixelStar'
import { useI18n } from '../../i18n/context'
import TestimonialAuthor from './TestimonialAuthor'

/**
 * Full testimonial in a native modal <dialog>: focus trap, Esc and the top
 * layer come from the browser. Closes on Esc, the close button or a click on
 * the backdrop.
 *
 * @param {{ testimonial: import('../../content/testimonials').Testimonial, onClose: () => void }} props
 */
export default function TestimonialDialog({ testimonial, onClose }) {
  const { t, l, locale } = useI18n()
  const dialogRef = useRef(null)
  const translated = locale !== testimonial.original
  const titleId = `testimonial-dialog-${testimonial.id}`
  // close() on the element gives focus back to the button that opened it;
  // onClose then unmounts. The async `close` event is not relied on.
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

  return (
    <dialog
      ref={dialogRef}
      className="testimonial-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div className="px-window">
        <div className="px-window-bar">
          <Icon name="message" size={16} />
          <span id={titleId} className="truncate">
            {t('testimonials.dialogTitle', { name: testimonial.name })}
          </span>
          <button
            type="button"
            className="testimonial-dialog-close"
            onClick={close}
            aria-label={t('testimonials.close')}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
        <figure className="testimonial-dialog-body">
          <div className="testimonial-head">
            <PixelStars
              rating={testimonial.rating}
              size={18}
              label={t('testimonials.rating', { n: testimonial.rating })}
            />
            {translated && (
              <span className="testimonial-translated" title={t(`testimonials.translatedFrom.${testimonial.original}`)}>
                <Icon name="translate" size={16} label={t(`testimonials.translatedFrom.${testimonial.original}`)} />
              </span>
            )}
          </div>
          <blockquote
            className="testimonial-quote testimonial-dialog-quote"
            lang={translated ? locale : testimonial.original}
          >
            {l(testimonial.text)
              .split('\n')
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </blockquote>
          <TestimonialAuthor testimonial={testimonial} />
        </figure>
      </div>
    </dialog>
  )
}
