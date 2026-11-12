import { useEffect, useRef } from 'react'
import CountryFlag from '../../components/icons/CountryFlag'
import Icon from '../../components/icons/Icon'
import { LOCALES } from '../../i18n/config'
import { useI18n } from '../../i18n/context'

/**
 * Language picker in a native modal <dialog>. Each option shows its flag and
 * its name in that language, so visitors find their own at a glance.
 *
 * @param {{ onClose: () => void }} props
 */
export default function LanguageDialog({ onClose }) {
  const { locale, setLocale, t } = useI18n()
  const dialogRef = useRef(null)

  // close() gives focus back to the button that opened it; onClose unmounts.
  const close = () => {
    dialogRef.current?.close()
    onClose()
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    document.documentElement.classList.add('modal-open')
    return () => document.documentElement.classList.remove('modal-open')
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="language-dialog"
      aria-labelledby="language-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClick={(event) => event.target === event.currentTarget && close()}
    >
      <div className="px-window">
        <div className="px-window-bar">
          <Icon name="translate" size={16} />
          <span id="language-dialog-title" className="truncate">
            {t('language.choose')}
          </span>
          <button type="button" className="language-dialog-close" onClick={close} aria-label={t('common.close')}>
            <Icon name="close" size={16} />
          </button>
        </div>
        <ul className="language-list">
          {Object.entries(LOCALES).map(([code, { flag, name }]) => (
            <li key={code}>
              <button
                type="button"
                className="language-choice"
                aria-current={locale === code}
                lang={LOCALES[code].htmlLang}
                onClick={() => {
                  setLocale(code)
                  close()
                }}
              >
                <CountryFlag code={flag} width={28} />
                <span className="language-choice-name">{name}</span>
                {locale === code && <Icon name="check" size={16} />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  )
}
