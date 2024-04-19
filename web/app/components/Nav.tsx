import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '~/lib/theme'

const Nav = () => {
  const { isDarkMode } = useTheme()

  return (
    <nav className="w-full border-b-1 bg-scale-300 p-4">
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
    </nav>
  )
}

export default Nav