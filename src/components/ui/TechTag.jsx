import Icon from '../icons/Icon'
import StackIcon from '../icons/StackIcon'
import { genericIconFor, stackIconFor } from '../icons/stackIcons'
import Chip from './Chip'

/**
 * Chip with the technology's logo (src/assets/stack) or, for skills without
 * one, a generic pixel icon. Unknown names render as a plain chip.
 *
 * @param {{ name: string, tone?: 'default' | 'blue' }} props
 */
export default function TechTag({ name, tone = 'blue' }) {
  const logo = stackIconFor(name)
  const generic = !logo && genericIconFor(name)

  return (
    <Chip tone={tone}>
      {logo && <StackIcon icon={logo} size={14} />}
      {generic && <Icon name={generic} size={14} />}
      {name}
    </Chip>
  )
}
