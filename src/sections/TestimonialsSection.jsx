import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../components/icons/Icon'
import TestimonialCard from '../components/testimonial/TestimonialCard'
import { Section } from '../components/ui'
import { SECTION } from '../config/site'
import { testimonials } from '../content/testimonials'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

const AUTOPLAY_MS = 8000

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Testimonials carousel: a horizontal scroll-snap track (swipe on touch),
 * arrow buttons and one dot per stop. Advances on its own until the visitor
 * hovers, focuses or touches it.
 */
export default function TestimonialsSection() {
  const { t } = useI18n()
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [lastIndex, setLastIndex] = useState(testimonials.length - 1)
  const [paused, setPaused] = useState(false)

  /** Distance between two cards, and how many stops the track has at its width. */
  const measure = useCallback(() => {
    const track = trackRef.current
    const first = track?.children[0]
    if (!first) return null
    const step = first.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || '0')
    return { track, step, last: Math.max(0, Math.round((track.scrollWidth - track.clientWidth) / step)) }
  }, [])

  const goTo = useCallback(
    (target) => {
      const metrics = measure()
      if (!metrics) return
      const next = target > metrics.last ? 0 : target < 0 ? metrics.last : target
      metrics.track.scrollTo({ left: next * metrics.step, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    },
    [measure],
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const sync = () => {
      const metrics = measure()
      if (!metrics) return
      setLastIndex(metrics.last)
      setIndex(Math.min(metrics.last, Math.round(track.scrollLeft / metrics.step)))
    }
    sync()
    track.addEventListener('scroll', sync, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(track)
    return () => {
      track.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [measure])

  useEffect(() => {
    if (paused || lastIndex === 0 || prefersReducedMotion()) return
    const timer = window.setInterval(() => {
      if (!document.hidden) goTo(index + 1)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(timer)
  }, [paused, index, lastIndex, goTo])

  return (
    <Section
      id={SECTION.testimonials}
      eyebrow={t('testimonials.eyebrow')}
      title={t('testimonials.title')}
      intro={t('testimonials.intro')}
    >
      <div
        className="carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label={t('testimonials.title')}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        {...reveal(1)}
      >
        <ul ref={trackRef} className="carousel-track">
          {testimonials.map((testimonial, position) => (
            <li
              key={testimonial.id}
              className="carousel-slide"
              aria-roledescription="slide"
              aria-label={t('testimonials.slide', { n: position + 1, total: testimonials.length })}
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>

        {lastIndex > 0 && (
          <div className="carousel-controls">
            <button
              type="button"
              className="px-icon-btn"
              onClick={() => goTo(index - 1)}
              aria-label={t('testimonials.previous')}
            >
              <Icon name="chevronLeft" size={18} />
            </button>
            <div className="carousel-dots">
              {Array.from({ length: lastIndex + 1 }, (_, dot) => (
                <button
                  key={dot}
                  type="button"
                  className="carousel-dot"
                  aria-current={dot === index ? 'true' : undefined}
                  aria-label={t('testimonials.goTo', { n: dot + 1 })}
                  onClick={() => goTo(dot)}
                />
              ))}
            </div>
            <button
              type="button"
              className="px-icon-btn"
              onClick={() => goTo(index + 1)}
              aria-label={t('testimonials.next')}
            >
              <Icon name="chevronRight" size={18} />
            </button>
          </div>
        )}
      </div>
    </Section>
  )
}
