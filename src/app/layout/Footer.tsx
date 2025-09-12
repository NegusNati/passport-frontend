import { Container } from '@/shared/ui/container'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-neutral-200">
      <Container className="py-10 text-sm text-neutral-600">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Passport.ET — All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-neutral-900">Privacy</a>
            <a href="#terms" className="hover:text-neutral-900">Terms</a>
            <a href="#contact" className="hover:text-neutral-900">Contact</a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
