import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '~/lib/theme'
import DarkModeToggle from './DarkModeToggle'
import GitHubLink from './GitHubLink'

const Nav = () => {
  const { isDarkMode } = useTheme()

  return (
    <nav className="w-full border-b-1 bg-scale-300 p-4 flex justify-between items-center">
      <Link href="https://tosbuddy.com/">
        <Image
          src={
            isDarkMode
              ? '/images/tosbuddy-logo-wordmark--dark.svg'
              : '/images/tosbuddy-logo-wordmark--light.svg'
          }
          alt="tosbuddy Logo"
          height={54}
          width={120}
        />
      </Link>
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        <GitHubLink />
      </div>
    </nav>
  )
}

export default Nav