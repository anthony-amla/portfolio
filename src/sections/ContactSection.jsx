import { useState } from 'react'
import Icon from '../components/icons/Icon'
import { Section } from '../components/ui'
import { SECTION } from '../config/site'
import { contacts } from '../content/portfolio'
import ContactForm from '../features/contact/ContactForm'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

const COPIED_FEEDBACK_MS = 2000

/** @param {{ channel: { id: string, value?: string, href: string, copyable?: boolean } }} props */
function ChannelCard({ channel }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const label = t(`contact.channels.${channel.id}.label`)
  const value = channel.value ?? t(`contact.channels.${channel.id}.value`)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
    } catch {
      window.location.href = channel.href
    }
  }

  const body = (
    <>
      <Icon name={channel.id} size={22} />
      <span className="channel-text">
        <span className="channel-label">{label}</span>
        <span className="channel-value">{value}</span>
      </span>
    </>
  )

  if (channel.copyable) {
    return (
      <button type="button" className="channel-card" onClick={handleCopy}>
        {body}
        <span className="channel-action">
          <Icon name={copied ? 'check' : 'copy'} size={16} />
          <span className="sr-only">{t(copied ? 'contact.copied' : 'contact.copy')}</span>
        </span>
      </button>
    )
  }

  return (
    <a className="channel-card" href={channel.href} target="_blank" rel="noreferrer">
      {body}
      <Icon name="externalLink" size={16} className="channel-action" />
    </a>
  )
}

/** @param {{ theme: 'day' | 'night', footer?: import('react').ReactNode }} props */
export default function ContactSection({ theme, footer }) {
  const { t } = useI18n()

  return (
    <Section
      id={SECTION.contact}
      eyebrow={t('contact.eyebrow')}
      title={t('contact.title')}
      intro={t('contact.intro')}
      footer={footer}
    >
      <div className="contact-grid">
        <div {...reveal(1)}>
          <ContactForm theme={theme} />
        </div>
        <ul className="channels">
          {contacts.map((channel, index) => (
            <li key={channel.id} {...reveal(index + 2)}>
              <ChannelCard channel={channel} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
