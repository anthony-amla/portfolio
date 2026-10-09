import StackIcon from '../components/icons/StackIcon'
import { Section } from '../components/ui'
import { SECTION } from '../config/site'
import { stack } from '../content/portfolio'
import { reveal } from '../hooks/useReveal'
import { useI18n } from '../i18n/context'

export default function StackSection() {
  const { t } = useI18n()

  return (
    <Section id={SECTION.stack} eyebrow={t('stack.eyebrow')} title={t('stack.title')} intro={t('stack.intro')}>
      <div className="inventory">
        {stack.map((group, index) => (
          <div key={group.id} className="inventory-group" {...reveal(index + 1)}>
            <h3 className="inventory-title">{t(`stack.groups.${group.id}`)}</h3>
            <ul className="slots">
              {group.items.map((item) => (
                <li key={item.name} className="slot">
                  <StackIcon icon={item.icon} />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
