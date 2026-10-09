import { useState } from 'react'
import Icon from '../../components/icons/Icon'
import { Window } from '../../components/ui'
import { CONTACT_ENDPOINT, TURNSTILE_SITE_KEY } from '../../config/site'
import { contacts } from '../../content/portfolio'
import { useI18n } from '../../i18n/context'
import TurnstileWidget from './TurnstileWidget'

const FIELD_LIMITS = { name: 80, contact: 120, message: 2000 }

const fallbackEmail = contacts.find((channel) => channel.id === 'email')?.value

/** @typedef {'idle' | 'sending' | 'sent' | 'error'} SubmitStatus */

async function sendMessage(payload) {
  const response = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Contact request failed with ${response.status}`)
}

/**
 * Contact form posting to the Pages Function. Shows the Turnstile widget when
 * a site key is configured.
 *
 * @param {{ theme: 'day' | 'night' }} props
 */
export default function ContactForm({ theme }) {
  const { t, locale } = useI18n()
  /** @type {[SubmitStatus, (status: SubmitStatus) => void]} */
  const [status, setStatus] = useState('idle')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaResetKey, setCaptchaResetKey] = useState(0)

  const subjects = t('contact.subjects')
  const captchaEnabled = Boolean(TURNSTILE_SITE_KEY)
  const waitingForCaptcha = captchaEnabled && !captchaToken

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = Object.fromEntries(new FormData(form))
    delete fields['cf-turnstile-response']

    setStatus('sending')
    try {
      await sendMessage({ ...fields, turnstileToken: captchaToken })
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
    } finally {
      if (captchaEnabled) setCaptchaResetKey((key) => key + 1)
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

        {captchaEnabled && (
          <TurnstileWidget
            siteKey={TURNSTILE_SITE_KEY}
            theme={theme}
            language={locale}
            onToken={setCaptchaToken}
            resetKey={captchaResetKey}
          />
        )}

        <div className="form-actions">
          <button type="submit" className="px-btn" disabled={status === 'sending' || waitingForCaptcha}>
            {t(status === 'sending' ? 'contact.sending' : 'contact.submit')} <Icon name="arrowRight" size={16} />
          </button>
          <p className="form-status" role="status">
            {status === 'sent' && <span className="text-success">{t('contact.sent')}</span>}
            {status === 'error' && (
              <span className="text-danger">
                {t('contact.error')} <a href={`mailto:${fallbackEmail}`}>{fallbackEmail}</a>.
              </span>
            )}
          </p>
        </div>
      </form>
    </Window>
  )
}
