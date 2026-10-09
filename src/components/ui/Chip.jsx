/**
 * @param {object} props
 * @param {'default' | 'blue' | 'gold' | 'green' | 'red'} [props.tone='default']
 * @param {import('react').ReactNode} props.children
 */
export default function Chip({ tone = 'default', children }) {
  return <span className={`chip chip-${tone}`}>{children}</span>
}
