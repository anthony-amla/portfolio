# Ghst · Portfolio

Pixel art portfolio of Murilo Araujo (Ghst): an interactive isometric room drawn on canvas, day/night themes, a procedural chiptune soundtrack and Portuguese/English content.

**Live:** https://ghst.com.br

Built with React 19, Vite 7 and Tailwind CSS 4. The site is static; the only server code is the contact form endpoint, a Cloudflare Pages Function.

## Getting started

```bash
npm install
npm run dev
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Vite dev server                                      |
| `npm run build`     | Production build to `dist/`                          |
| `npm run preview`   | Serves the production build                          |
| `npm run lint`      | ESLint                                               |
| `npm run format`    | Prettier (write)                                     |
| `npm run check`     | Lint, format check and build, in that order          |
| `npm run dev:pages` | Build and run on Wrangler, including the contact API |
| `npm run deploy`    | Build and deploy to Cloudflare Pages                 |

The contact form only works on Pages (or with `npm run dev:pages`). Under `npm run dev` it shows the fallback error with the email address.

## Project structure

```
functions/api/contact.js     Pages Function: validates the form and forwards it to Discord
public/                      Static files (favicon, server logos)
src/
  App.jsx                    Route switch, navbar and corner controls
  main.jsx                   Entry point and providers
  config/site.js             Section ids, nav items and storage keys
  content/portfolio.js       Language-independent data: links, images, ids, relations
  content/projects/*.json    One file per project: data and text together
  i18n/                      Translations: locales/*.json, provider and translate function
  lib/                       Router, date helpers, safe localStorage access
  hooks/                     useTheme, useReveal, useDocumentTitle
  components/
    icons/                   Pixel icons, stack logos, country flags
    ui/                      Chip, Cover, Section, StatusFlag, Window
    project/                 ProjectCard
  features/
    room/                    Canvas renderer, scene and avatar portrait
    music/                   Web Audio synthesizer and toggle
    language/                Language switcher
  layout/                    Navbar, Footer, CornerControls
  pages/                     HomePage, ProjectPage, NotFoundPage
  sections/                  Home page sections
  styles/                    Tokens, base, UI primitives, layout and per-area styles
  assets/stack/              Technology logos (SVG)
```

Routes: `/` (home, with `#about`, `#journey`, `#servers`, `#projects`, `#stack`, `#contact` anchors) and `/projects/:id`. Anything else renders the 404 page.

## Editing content

- **Text:** every visible string lives in `src/i18n/locales/pt-BR.json` and `en.json`. Both files share the same keys; Portuguese is the default and the fallback for missing keys. Placeholders use `{name}`.
- **Data:** links, images, server names and the relations between them live in `src/content/portfolio.js`. Items are matched to their text by `id` in the locale files.
- **Projects:** one JSON file per project in `src/content/projects/`, with data and text (both languages) together. The editor validates and autocompletes it through `src/content/project.schema.json`. Text fields take a plain string or `{ "pt-BR": "...", "en": "..." }`. To add a project, copy an existing file and change its `id` (the URL becomes `/projects/<id>`); to remove one, delete the file or set `"hidden": true`. Optional blocks (`video`, `gallery`, `impact`, `servers`, `about`, `flow`, `stack`) only render when present. `kind` sets the badge: `owned`, `exclusive` or `closed`. Media can come from the CDN (`https://cdn.ghst.com.br/...`).
- **Servers:** `servers` in `portfolio.js`. A project lists where it has run with `"servers": ["miami", ...]`. Add `offline: true` to a server that shut down: it stays listed, greyed out.
- **Images:** use a URL or a path inside `public/` (e.g. `/servers/revoada.webp`). An empty string renders the pixel art placeholder.
- **Stack logos:** SVGs in `src/assets/stack/<name>.svg`. Single-color logos use `currentColor` so they follow the theme. Tech tags find their logo by name ("Node.js" -> `nodejs.svg`); add aliases in `src/components/icons/stackIcons.js`.
- **Warning flag:** on a journey stage, set `flagged: true` and add a `flag` text in the locale files. On a project, add a `flag` text to its JSON; it also hides the external link.
- **Career dates:** `period: { start: '2025-08', end: '2025-12' }` on a journey stage, as `YYYY` or `YYYY-MM`. Leave `end` out for an ongoing stage. Dates are formatted per language.
- **Start year:** `profile.startYear` feeds every `{startYear}` placeholder in the texts and the level counter.

### Adding a language

1. Copy `src/i18n/locales/en.json` to a new file and translate it.
2. Register it in `LOCALES` in `src/i18n/config.js` with its `htmlLang` and `flag`.
3. Add the flag to `src/components/icons/CountryFlag.jsx` and the language name under `language.names` in every locale.

## Contact form

`POST /api/contact` (`functions/api/contact.js`) validates the form, drops honeypot submissions, optionally checks Cloudflare Turnstile and delivers the message to every configured channel. It succeeds when at least one channel delivers.

| Variable                  | Where                    | Purpose                                                              |
| ------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `DISCORD_WEBHOOK_URL`     | Secret                   | Discord channel webhook                                              |
| `RESEND_API_KEY`          | Secret                   | [Resend](https://resend.com) API key (free plan: 3,000 emails/month) |
| `CONTACT_EMAIL_TO`        | Variable                 | Inbox that receives the messages                                     |
| `CONTACT_EMAIL_FROM`      | Variable, optional       | Custom sender; requires a domain verified on Resend                  |
| `TURNSTILE_SECRET_KEY`    | Secret, optional         | Turnstile secret key; enables server-side anti-spam                  |
| `VITE_TURNSTILE_SITE_KEY` | Build variable, optional | Overrides the production site key in `src/config/site.js`            |

Configure Discord, email or both. Without a verified domain, Resend only delivers to the address you signed up with, sent from `onboarding@resend.dev`; replies go straight to the visitor when they typed an email. The production site key is already in `src/config/site.js`, so production only needs `TURNSTILE_SECRET_KEY`; without it the server skips the check.

## Deploying to Cloudflare Pages

### From GitHub (recommended)

1. Push this project to a GitHub repository.
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repository.
3. Build settings: framework preset `Vite`, build command `npm run build`, output directory `dist`. The Node version comes from `.nvmrc`.
4. Plain variables (`CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`) live in `wrangler.toml` under `[vars]`; Pages reads them from there. Add the secrets (`DISCORD_WEBHOOK_URL`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) under **Settings → Variables and Secrets**.
5. Redeploy once after adding variables; they apply from the next deployment on.
6. Every `git push` publishes a new version.

Deep links such as `/projects/ghst-store` work out of the box: without a `404.html`, Pages serves `index.html` for unknown paths. `public/_headers` adds basic security headers and long caching for hashed assets.

The site is served on the custom domains `ghst.com.br` and `www.ghst.com.br` (Pages → Custom domains), with `ghst-portfolio.pages.dev` as the default Pages URL. If the domain changes, update the absolute `og:url` and `og:image` URLs in `index.html` and the Turnstile widget hostnames.

### From the terminal

```bash
npx wrangler login
npm run deploy
npx wrangler pages secret put DISCORD_WEBHOOK_URL --project-name ghst-portfolio
```

To test the contact endpoint locally, copy `.dev.vars.example` to `.dev.vars`, fill in the channels and run `npm run dev:pages`.

## Credits

UI icons: [pixelarticons](https://github.com/halfmage/pixelarticons) (MIT). Stack logos: [devicon](https://devicon.dev) (MIT).
