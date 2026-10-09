import Icon from '../icons/Icon'

/**
 * Game-style panel with a title bar.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.title
 * @param {string} [props.icon] Icon name shown before the title.
 * @param {import('react').ReactNode} props.children
 */
export default function Window({ title, icon, children }) {
  return (
    <div className="px-window">
      <div className="px-window-bar">
        {icon && <Icon name={icon} size={16} />}
        <span className="truncate">{title}</span>
      </div>
      <div className="px-window-body">{children}</div>
    </div>
  )
}
