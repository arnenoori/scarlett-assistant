import { Button } from '~/components/Button'
import { Container } from '~/components/Container'
import { Logo } from '~/components/Logo'
import Link from 'next/link'
import GitHubLink from './GitHubLink'

export function Header() {
  return (
    <header className="relative z-50 flex-none lg:pt-11">
      <Container className="flex flex-wrap items-center justify-between lg:flex-nowrap">
        <div className="mt-10 lg:mt-0 lg:grow lg:basis-0">
          <Link href="/" legacyBehavior>
            <a>
              <Logo className="h-auto w-48 text-slate-900" /> {/* Adjusted size and wrapped in Link */}
            </a>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <GitHubLink /> {/* Added GitHub link to the left of the button */}
          <Button href="/websites">Add a website</Button>
        </div>
      </Container>
    </header>
  )
}