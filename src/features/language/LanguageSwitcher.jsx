import CountryFlag from '../../components/icons/CountryFlag'
import { LOCALES } from '../../i18n/config'
import { useI18n } from '../../i18n/context'

/** Segmented control with one flag per available locale. */
export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="language-switcher" role="group" aria-label={t('language.label')}>
      {Object.entries(LOCALES).map(([code, { flag }]) => {
        const name = t(`language.names.${code}`)
        return (
          <button
            key={code}
            type="button"
            className="language-option"
            onClick={() => setLocale(code)}
            aria-pressed={locale === code}
            aria-label={name}
            title={name}
          >
            <CountryFlag code={flag} />
          </button>
        )
      })}
    </div>
  )
}
