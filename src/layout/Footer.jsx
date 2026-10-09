import { profile } from '../content/portfolio'
import { useI18n } from '../i18n/context'
import { currentYear } from '../lib/date'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="footer">
      <p>{t('footer.credits', { year: currentYear(), name: profile.name, nick: profile.nick })}</p>
    </footer>
  )
}
