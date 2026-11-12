import { useState } from 'react'
import CountryFlag from '../../components/icons/CountryFlag'
import { LOCALES } from '../../i18n/config'
import { useI18n } from '../../i18n/context'
import LanguageDialog from './LanguageDialog'

/** Current language as a corner button; opens the language picker. */
export default function LanguageSwitcher() {
  const { locale, t } = useI18n()
  const [open, setOpen] = useState(false)
  const current = LOCALES[locale]

  return (
    <>
      <button
        type="button"
        className="language-toggle"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={t('language.choose')}
        title={t('language.choose')}
      >
        <CountryFlag code={current.flag} />
        <span className="control-label">{current.short}</span>
      </button>
      {open && <LanguageDialog onClose={() => setOpen(false)} />}
    </>
  )
}
