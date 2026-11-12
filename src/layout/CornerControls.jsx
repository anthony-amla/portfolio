import LanguageSwitcher from '../features/language/LanguageSwitcher'
import MusicToggle from '../features/music/MusicToggle'

/** Floating controls in the bottom-right corner: language above, music below. */
export default function CornerControls() {
  return (
    <div className="corner-controls">
      <LanguageSwitcher />
      <MusicToggle />
    </div>
  )
}
