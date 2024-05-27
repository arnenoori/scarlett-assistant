import { Layout } from '~/components/Layout';
import RootLayout from '~/pages/layout'; // Adjust the path to where RootLayout is defined

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RootLayout>
      <Layout>{children}</Layout>
    </RootLayout>
  );
}