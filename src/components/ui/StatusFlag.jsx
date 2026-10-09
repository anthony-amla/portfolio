import Icon from '../icons/Icon'

/**
 * Red warning chip with a flag icon (e.g. something paused or offline).
 * @param {{ children: import('react').ReactNode }} props
 */
export default function StatusFlag({ children }) {
  return (
    <span className="chip chip-red">
      <Icon name="flag" size={14} />
      {children}
    </span>
  )
}
