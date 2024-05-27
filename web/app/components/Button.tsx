import Link from 'next/link'
import clsx from 'clsx'
import { ButtonHTMLAttributes, DetailedHTMLProps, AnchorHTMLAttributes } from 'react';

type ButtonProps =
  | (React.ComponentPropsWithoutRef<typeof Link> & { href: string })  // Ensure href is required for Link
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })

export function Button({ className, ...props }: ButtonProps) {
  className = clsx(
    'inline-flex justify-center rounded-2xl bg-blue-900 p-4 text-base font-semibold text-white hover:bg-blue-500 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:text-white/70',
    className,
  )

  // Filter props for button element
  const buttonProps: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> = {
    className,
    ...props as ButtonHTMLAttributes<HTMLButtonElement>
  };

  // Filter props for Link element
  const linkProps: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> = {
    className,
    ...props as AnchorHTMLAttributes<HTMLAnchorElement>
  };

  return typeof props.href === 'undefined' ? (
    <button {...buttonProps} />
  ) : (
    <Link {...linkProps} href={props.href} />  // Explicitly pass href to ensure it's provided
  )
}