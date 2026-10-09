import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useI18n } from '../i18n/context'
import Footer from '../layout/Footer'
import AboutSection from '../sections/AboutSection'
import ContactSection from '../sections/ContactSection'
import HeroSection from '../sections/HeroSection'
import JourneySection from '../sections/JourneySection'
import ProjectsSection from '../sections/ProjectsSection'
import ServersSection from '../sections/ServersSection'
import StackSection from '../sections/StackSection'
import TestimonialsSection from '../sections/TestimonialsSection'

/**
 * @param {object} props
 * @param {'day' | 'night'} props.theme
 * @param {() => void} props.onToggleTheme
 */
export default function HomePage({ theme, onToggleTheme }) {
  const { t } = useI18n()
  useDocumentTitle(t('meta.title'))

  return (
    <>
      <HeroSection theme={theme} onToggleTheme={onToggleTheme} />
      <AboutSection />
      <JourneySection />
      <ServersSection />
      <ProjectsSection />
      <StackSection />
      <TestimonialsSection />
      <ContactSection theme={theme} footer={<Footer />} />
    </>
  )
}
