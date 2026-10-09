/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Forwards the contact form to a Discord webhook. Set the DISCORD_WEBHOOK_URL
 * secret in the Pages dashboard (Settings → Variables and Secrets); it never
 * reaches the browser.
 */

const FIELDS = {
  name: { max: 80, required: true },
  contact: { max: 120, required: true },
  subject: { max: 60, required: false },
  message: { max: 2000, required: true },
}

const EMBED_COLOR = 0x3e7fdc

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

/** Breaks @mentions so visitor text cannot ping the channel. */
const sanitize = (value) =>
  String(value ?? '')
    .replace(/@/g, '@\u200b')
    .trim()

function validate(data) {
  for (const [field, rule] of Object.entries(FIELDS)) {
    const value = String(data[field] ?? '').trim()
    if (rule.required && !value) return `missing_${field}`
    if (value.length > rule.max) return `too_long_${field}`
  }
  return null
}

function buildDiscordPayload(data) {
  return {
    username: 'Portfolio',
    allowed_mentions: { parse: [] },
    embeds: [
      {
        title: sanitize(data.subject) || 'New contact',
        description: sanitize(data.message),
        color: EMBED_COLOR,
        fields: [
          { name: 'Name', value: sanitize(data.name), inline: true },
          { name: 'Contact', value: sanitize(data.contact), inline: true },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  }
}

export async function onRequestPost({ request, env }) {
  if (!env.DISCORD_WEBHOOK_URL) return json({ ok: false, error: 'not_configured' }, 503)

  let data
  try {
    data = await request.json()
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400)
  }

  // Honeypot filled in: pretend it worked and drop it.
  if (data.website) return json({ ok: true })

  const error = validate(data)
  if (error) return json({ ok: false, error }, 400)

  const response = await fetch(env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildDiscordPayload(data)),
  })

  if (!response.ok) return json({ ok: false, error: 'upstream' }, 502)
  return json({ ok: true })
}
