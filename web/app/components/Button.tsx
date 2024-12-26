import Link from 'next/link'
import clsx from 'clsx'

type ButtonOrLinkProps = {
  className?: string
  children?: React.ReactNode
}

type ButtonAsButton = ButtonOrLinkProps & {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>

type ButtonAsLink = ButtonOrLinkProps & {
  href: string
} & Omit<React.ComponentProps<typeof Link>, 'href'>

type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({ className, ...props }: ButtonProps) {
  className = clsx(
    'inline-flex justify-center rounded-2xl bg-blue-900 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70',
    className,
  )

  if ('href' in props) {
    return <Link className={className} {...(props as ButtonAsLink)} />
  }

  return <button type="button" className={className} {...(props as ButtonAsButton)} />
}