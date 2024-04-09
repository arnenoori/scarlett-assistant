import { IconGitHub } from '@supabase/ui'

const GitHubLink = () => {
  const githubUrl = 'https://github.com/arnenoori/tos-buddy'

  return (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-scale-900 hover:text-scale-1100 transition-colors duration-200"
    >
      <IconGitHub size={20} strokeWidth={2} />
    </a>
  )
}

export default GitHubLink