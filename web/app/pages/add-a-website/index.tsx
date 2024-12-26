import AddAWebsite from '~/components/AddAWebsite';
import supabase from '~/lib/supabase';
import { Layout } from '~/components/Layout';

export default function AddAWebsitePage() {
  return (
    <Layout>
      <AddAWebsite supabase={supabase} />
    </Layout>
  );
}