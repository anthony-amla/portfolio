/**
 * Projects: one JSON file per project in this folder, validated by
 * ../project.schema.json. Adding a project is adding a file; removing it is
 * deleting the file (or setting "hidden": true).
 *
 * Text fields hold a plain value or `{ "pt-BR": ..., "en": ... }`; components
 * resolve them with `l()` from useI18n.
 *
 * @typedef {object} Project
 * @property {string} id
 * @property {number} order
 * @property {'owned' | 'exclusive' | 'closed'} kind
 * @property {any} [kindLabel]
 * @property {any} [flag]
 * @property {any} title
 * @property {any} summary
 * @property {string} cover
 * @property {string[]} tags
 * @property {{ href: string, label: any }} [link]
 * @property {{ src: string, poster?: string, caption?: any }} [video]
 * @property {{ src: string, caption?: any }[]} [gallery]
 * @property {any} [features]
 * @property {any} [about]
 * @property {{ value: any, label: any }[]} [impact]
 * @property {{ name: any, tech?: string, text: any }[]} [flow]
 * @property {{ name: string, icon?: string, role: any }[]} [stack]
 */

const files = import.meta.glob('./*.json', { eager: true, import: 'default' })

/** @type {Project[]} */
export const projects = Object.values(files)
  .filter((project) => !project.hidden)
  .sort((a, b) => a.order - b.order)

/** Chip tone used for each project kind. */
export const KIND_TONE = {
  owned: 'gold',
  exclusive: 'green',
  closed: 'default',
}

/**
 * Badge text: the project's own label, or the default one for its kind.
 *
 * @param {Project} project
 * @param {{ t: Function, l: Function }} i18n
 */
export const kindLabel = (project, { t, l }) =>
  project.kindLabel ? l(project.kindLabel) : t(`projects.kinds.${project.kind}`)
