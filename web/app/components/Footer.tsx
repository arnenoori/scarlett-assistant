import DarkModeToggle from './DarkModeToggle'
import GitHubLink from './GitHubLink'

const Footer = () => {
  return (
    <footer className="flex w-full items-center justify-between border-t bg-scale-300 p-4">
      <div className="text-scale-900">Made with love by Cal Poly Students</div>
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        <GitHubLink />
      </div>
    </footer>
  )
}

export default Footer