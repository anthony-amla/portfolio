import TechLogo from '../icons/TechLogo'
import Chip from './Chip'

/**
 * Chip with the technology's logo or, for skills without one, a generic pixel
 * icon. Unknown names render as a plain chip.
 *
 * @param {{ name: string, tone?: 'default' | 'blue' }} props
 */
export default function TechTag({ name, tone = 'blue' }) {
  return (
    <Chip tone={tone}>
      <TechLogo name={name} />
      {name}
    </Chip>
  )
}
