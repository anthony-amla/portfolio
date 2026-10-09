import Icon from './Icon'
import StackIcon from './StackIcon'
import { genericIconFor, stackIconFor } from './stackIcons'

/**
 * Logo for a technology or skill: the brand logo from src/assets/stack when
 * there is one, otherwise a generic pixel icon, otherwise nothing.
 *
 * @param {{ name: string, icon?: string, size?: number }} props
 */
export default function TechLogo({ name, icon, size = 14 }) {
  const logo = icon ?? stackIconFor(name)
  if (logo) return <StackIcon icon={logo} size={size} />

  const generic = genericIconFor(name)
  return generic ? <Icon name={generic} size={size} /> : null
}
