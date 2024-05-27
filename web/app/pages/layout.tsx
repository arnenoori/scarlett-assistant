import { DM_Sans, Inter } from 'next/font/google';
import clsx from 'clsx';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={clsx(
      'h-full bg-white antialiased',
      inter.variable,
      dmSans.variable,
    )}>
      <div className="flex min-h-full">
        <div className="flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
}