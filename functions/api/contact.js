/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Validates the contact form and delivers it to every configured channel.
 * All settings are Pages environment variables (Settings → Variables and Secrets):
 *
 *   DISCORD_WEBHOOK_URL   Discord channel webhook (optional)
 *   RESEND_API_KEY        Resend API key (optional, enables email)
 *   CONTACT_EMAIL_TO      Inbox that receives the messages (required for email)
 *   CONTACT_EMAIL_FROM    Sender; defaults to Resend's onboarding address
 *   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret (optional, enables anti-spam)
 *
 * At least one channel (Discord or email) must be configured.
 */

const FIELDS = {
  name: { max: 80, required: true },
  contact: { max: 120, required: true },
  subject: { max: 60, required: false },
  message: { max: 2000, required: true },
}

const DEFAULT_EMAIL_FROM = 'Portfolio <onboarding@resend.dev>'
const EMBED_COLOR = 0x3e7fdc
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const RESEND_URL = 'https://api.resend.com/emails'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

const field = (data, name) => String(data[name] ?? '').trim()

/** Breaks @mentions so visitor text cannot ping the Discord channel. */
const sanitizeMentions = (value) => value.replace(/@/g, '@​')

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

function validate(data) {
  for (const [name, rule] of Object.entries(FIELDS)) {
    const value = field(data, name)
    if (rule.required && !value) return `missing_${name}`
    if (value.length > rule.max) return `too_long_${name}`
  }
  return null
}

async function verifyTurnstile(token, secret, ip) {
  if (!token) return false
  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)
  const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body })
  const result = await response.json()
  return result.success === true
}

async function sendToDiscord(message, webhookUrl) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Portfolio',
      allowed_mentions: { parse: [] },
      embeds: [
        {
          title: sanitizeMentions(message.subject) || 'New contact',
          description: sanitizeMentions(message.message),
          color: EMBED_COLOR,
          fields: [
            { name: 'Name', value: sanitizeMentions(message.name), inline: true },
            { name: 'Contact', value: sanitizeMentions(message.contact), inline: true },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  })
  if (!response.ok) throw new Error(`Discord responded with ${response.status}`)
}

async function sendEmail(message, env) {
  const replyTo = EMAIL_PATTERN.test(message.contact) ? message.contact : undefined
  const html = `
    <p><strong>Name:</strong> ${escapeHtml(message.name)}</p>
    <p><strong>Contact:</strong> ${escapeHtml(message.contact)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(message.subject || '-')}</p>
    <p style="white-space:pre-wrap">${escapeHtml(message.message)}</p>`

  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_EMAIL_FROM || DEFAULT_EMAIL_FROM,
      to: [env.CONTACT_EMAIL_TO],
      reply_to: replyTo,
      subject: `[Portfolio] ${message.subject || 'New contact'} · ${message.name}`,
      text: `Name: ${message.name}\nContact: ${message.contact}\nSubject: ${message.subject || '-'}\n\n${message.message}`,
      html,
    }),
  })
  if (!response.ok) throw new Error(`Resend responded with ${response.status}`)
}

function deliveryChannels(env) {
  const channels = []
  if (env.DISCORD_WEBHOOK_URL) channels.push((message) => sendToDiscord(message, env.DISCORD_WEBHOOK_URL))
  if (env.RESEND_API_KEY && env.CONTACT_EMAIL_TO) channels.push((message) => sendEmail(message, env))
  return channels
}

export async function onRequestPost({ request, env }) {
  const channels = deliveryChannels(env)
  if (channels.length === 0) return json({ ok: false, error: 'not_configured' }, 503)

  let data
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400)
  }

  // Honeypot filled in: pretend it worked and drop it.
  if (field(data, 'website')) return json({ ok: true })

  if (env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get('CF-Connecting-IP')
    const human = await verifyTurnstile(field(data, 'turnstileToken'), env.TURNSTILE_SECRET_KEY, ip)
    if (!human) return json({ ok: false, error: 'captcha_failed' }, 403)
  }

  const error = validate(data)
  if (error) return json({ ok: false, error }, 400)

  const message = Object.fromEntries(Object.keys(FIELDS).map((name) => [name, field(data, name)]))
  const results = await Promise.allSettled(channels.map((send) => send(message)))
  const delivered = results.some((result) => result.status === 'fulfilled')

  results
    .filter((result) => result.status === 'rejected')
    .forEach((result) => console.error('Contact delivery failed:', result.reason))

  if (!delivered) return json({ ok: false, error: 'upstream' }, 502)
  return json({ ok: true })
}
