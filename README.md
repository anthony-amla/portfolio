# Ghst · Portfolio

Pixel art portfolio of Murilo Araujo (Ghst): an interactive isometric room drawn on canvas, day/night themes, a procedural chiptune soundtrack and Portuguese/English content.

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
- **Data:** links, images, server names, project tags and the relations between them live in `src/content/portfolio.js`. Items are matched to their text by `id` (for example `projects.items.<id>` in the locale files).
- **Images:** use a URL or a path inside `public/` (e.g. `/servers/revoada.webp`). An empty string renders the pixel art placeholder.
- **Stack logos:** SVGs in `src/assets/stack/<name>.svg`. Single-color logos use `currentColor` so they follow the theme.
- **Warning flag:** set `flagged: true` on a journey stage or project and add a `flag` text in the locale files. On projects it also hides the external link.

### Adding a language

1. Copy `src/i18n/locales/en.json` to a new file and translate it.
2. Register it in `LOCALES` in `src/i18n/config.js` with its `htmlLang` and `flag`.
3. Add the flag to `src/components/icons/CountryFlag.jsx` and the language name under `language.names` in every locale.

## Deploying to Cloudflare Pages

### From GitHub (recommended)

1. Push this project to a GitHub repository (private is fine).
2. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, then pick the repository.
3. Build settings: framework preset `Vite`, build command `npm run build`, output directory `dist`.
4. Under **Settings → Variables and Secrets**, add the secret `DISCORD_WEBHOOK_URL` with the webhook of the Discord channel that should receive messages.
5. Every `git push` publishes a new version.

Deep links such as `/projects/ghst-store` work out of the box: without a `404.html`, Pages serves `index.html` for unknown paths.

### From the terminal

```bash
npx wrangler login
npm run deploy
npx wrangler pages secret put DISCORD_WEBHOOK_URL --project-name ghst-portfolio
```

To test the contact endpoint locally, copy `.dev.vars.example` to `.dev.vars`, set the webhook and run `npm run dev:pages`.

## Credits

UI icons: [pixelarticons](https://github.com/halfmage/pixelarticons) (MIT). Stack logos: [devicon](https://devicon.dev) (MIT).
