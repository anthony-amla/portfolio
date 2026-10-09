/**
 * Testimonials: data and text together in ./testimonials.json, one entry per
 * person. `original` is the language the person wrote in; any other language
 * is a translation and shows the translate icon.
 *
 * Text fields hold a plain value or `{ "pt-BR": ..., "en": ... }`; resolve
 * them with `l()` from useI18n.
 *
 * @typedef {object} Testimonial
 * @property {string} id
 * @property {string} name
 * @property {any} role
 * @property {string} company
 * @property {'manager' | 'client' | 'supervisor' | 'colleague' | 'other'} relation
 * @property {number} rating 1 to 5
 * @property {string} original Locale the text was written in
 * @property {any} text
 */

import data from './testimonials.json'

/** @type {Testimonial[]} */
export const testimonials = data
