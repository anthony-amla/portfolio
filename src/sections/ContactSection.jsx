import { useState } from 'react'
import Icon from '../components/icons/Icon'
import { Section, Window } from '../components/ui'
import { SECTION } from '../config/site'
import { contacts } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

const CONTACT_ENDPOINT = '/api/contact'
const COPIED_FEEDBACK_MS = 2000

const FIELD_LIMITS = { name: 80, contact: 120, message: 2000 }

const email = contacts.find((channel) => channel.id === 'email')?.value

/** @typedef {'idle' | 'sending' | 'sent' | 'error'} SubmitStatus */

async function sendMessage(payload) {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Contact request failed with ${response.status}`)
}

function ContactForm() {
  const { t } = useI18n()
  /** @type {[SubmitStatus, (status: SubmitStatus) => void]} */
  const [status, setStatus] = useState('idle')
  const subjects = t('contact.subjects')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    try {
      await sendMessage(Object.fromEntries(new FormData(form)))
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Window title={t('contact.windowTitle')} icon="mail">
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="field">
            <span>{t('contact.fields.name')}</span>
            <input name="name" required maxLength={FIELD_LIMITS.name} autoComplete="name" />
          </label>
          <label className="field">
            <span>{t('contact.fields.contact')}</span>
            <input name="contact" required maxLength={FIELD_LIMITS.contact} />
          </label>
        </div>

        <label className="field">
          <span>{t('contact.fields.subject')}</span>
          <select name="subject" defaultValue={subjects[0]}>
            {subjects.map((subject) => (
              <option key={subject}>{subject}</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{t('contact.fields.message')}</span>
          <textarea name="message" required rows={5} maxLength={FIELD_LIMITS.message} />
        </label>

        {/* Honeypot: hidden from people, filled in by bots. */}
        <input name="website" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden />

        <div className="form-actions">
          <button type="submit" className="px-btn" disabled={status === 'sending'}>
            {t(status === 'sending' ? 'contact.sending' : 'contact.submit')} <Icon name="arrowRight" size={16} />
          </button>
          <p className="form-status" role="status">
            {status === 'sent' && <span className="text-success">{t('contact.sent')}</span>}
            {status === 'error' && (
              <span className="text-danger">
                {t('contact.error')} <a href={`mailto:${email}`}>{email}</a>.
              </span>
            )}
          </p>
        </div>
      </form>
    </Window>
  )
}

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

/** @param {{ footer?: import('react').ReactNode }} props */
export default function ContactSection({ footer }) {
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
          <ContactForm />
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
