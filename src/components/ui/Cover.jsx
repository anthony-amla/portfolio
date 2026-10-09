import { useState } from 'react'
import { useI18n } from '../../i18n/context'

const MIN_WORD_LENGTH = 3

function initials(text) {
  return text
    .split(/[\s.]+/)
    .filter((word) => word.length >= MIN_WORD_LENGTH || /^[A-Z]/.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('')
}

/**
 * Image with a pixel art placeholder (title initials) when there is no
 * source or it fails to load.
 *
 * @param {object} props
 * @param {string} [props.src]
 * @param {string} props.title Used as alt text and for the placeholder initials.
 * @param {string} [props.className]
 */
export default function Cover({ src, title, className = '' }) {
  const { t } = useI18n()
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return <img src={src} alt={title} loading="lazy" className={`cover ${className}`} onError={() => setFailed(true)} />
  }

  return (
    <div className={`cover cover-placeholder ${className}`} role="img" aria-label={t('common.noImage', { title })}>
      <span>{initials(title)}</span>
    </div>
  )
}
