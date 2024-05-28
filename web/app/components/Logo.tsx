import React from 'react';

export function Logo(props: React.ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      src="/images/tosbuddy-logo-wordmark--light.svg"
      alt="Tosbuddy Logo"
      width="200" // increased width for a larger display
      height="auto" // maintain aspect ratio
      {...props}
    />
  );
}