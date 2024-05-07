import { GetServerSideProps } from 'next';
import { generateSitemap } from '~/lib/generate-sitemap';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = await generateSitemap();

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function Sitemap() {
  return null;
}