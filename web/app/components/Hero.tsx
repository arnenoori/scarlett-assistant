import { BackgroundImage } from '~/components/BackgroundImage'
import { Button } from '~/components/Button'
import { Container } from '~/components/Container'

export function Hero() {
  return (
    <div className="relative py-20 sm:pb-24 sm:pt-36">
      <BackgroundImage className="-bottom-14 -top-36" />
      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:max-w-4xl lg:px-12">
          <h1 className="font-display text-5xl font-bold tracking-tighter text-blue-1100 sm:text-7xl">
            <span className="sr-only">TOS Buddy - </span>Making Terms of Service Easy to Understand
          </h1>
          <div className="mt-6 space-y-6 font-display text-2xl tracking-tight text-blue-900">
            <p>
              TOS Buddy helps users understand and control their privacy on the internet. 
              We simplify complex terms of service so you can make informed decisions.
            </p>
            <p>
              Join us in our mission to bring transparency to online agreements and protect your personal information.
            </p>
          </div>
          <Button href="#" className="mt-10 w-full sm:hidden">
            Get Started
          </Button>
          <dl className="mt-10 grid grid-cols-2 gap-x-10 gap-y-6 sm:mt-16 sm:gap-x-16 sm:gap-y-10 sm:text-center lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:justify-start lg:text-left">
            {[
              ['Websites Analyzed', '200'],
              ['Users', '0'],
              ['API Integrations', '50+'],
            ].map(([name, value]) => (
              <div key={name}>
                <dt className="font-mono text-sm text-blue-1100">{name}</dt>
                <dd className="mt-0.5 text-2xl font-semibold tracking-tight text-blue-900">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </div>
  )
}