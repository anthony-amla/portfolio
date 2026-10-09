import { useEffect, useState } from 'react'
import Icon from '../../components/icons/Icon'
import PixelStars from '../../components/icons/PixelStar'
import { SECTION } from '../../config/site'
import { testimonials } from '../../content/testimonials'
import { useI18n } from '../../i18n/context'

const SHOW_MS = 9000

/** Random order of indexes; a new round never starts with the one just shown. */
function shuffledRound(previous) {
  const order = testimonials.map((_, index) => index)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  if (order.length > 1 && order[0] === previous) order.push(order.shift())
  return order
}

/**
 * Pixel thought cloud floating over the room: one testimonial at a time, in a
 * random order that goes through everyone before repeating. Pauses on hover;
 * a click jumps to the testimonials section.
 */
export default function TestimonialCloud() {
  const { t, l } = useI18n()
  const [queue, setQueue] = useState(() => shuffledRound(-1))
  const [paused, setPaused] = useState(false)
  const current = testimonials[queue[0]]

  useEffect(() => {
    if (paused || testimonials.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(() => {
      setQueue((previous) => (previous.length > 1 ? previous.slice(1) : shuffledRound(previous[0])))
    }, SHOW_MS)
    return () => window.clearTimeout(timer)
  }, [queue, paused])

  if (!current) return null

  return (
    <button
      type="button"
      className="testimonial-cloud"
      onClick={() => document.getElementById(SECTION.testimonials)?.scrollIntoView({ behavior: 'smooth' })}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-label={t('testimonials.cloudLabel')}
    >
      <span key={current.id} className="testimonial-cloud-body">
        <span className="testimonial-cloud-head">
          <Icon name="message" size={14} />
          {t('testimonials.cloudTitle')}
          <PixelStars rating={current.rating} size={9} label={t('testimonials.rating', { n: current.rating })} />
        </span>
        <span className="testimonial-cloud-text">“{l(current.text)}”</span>
        <span className="testimonial-cloud-author">— {current.name}</span>
      </span>
    </button>
  )
}
