import os
from supabase import create_client, Client
from dotenv import load_dotenv
import requests

# load environment variables from .env.local file
load_dotenv(dotenv_path='.env.local')

# retrieve environment variables
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# check if the environment variables are loaded correctly
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the .env.local file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def ensure_terms_of_service():
    """
    Ensures every website has an associated terms of service by creating missing entries and running the crawler.
    """
    response = supabase.table('websites').select('*').execute()
    websites = response.data
    
    for site in websites:
        # check if the website has an associated terms of service
        tos_response = supabase.table('terms_of_service').select('*').eq('website_id', site['id']).execute()
        tos_data = tos_response.data
        
        if not tos_data:
            # create a new terms of service entry for the website
            new_tos = {
                'website_id': site['id'],
                'simplified_content': None,
                'tos_url': site.get('tos_url'),
                'file_path': None,
                'created_at': 'now()',
                'updated_at': 'now()',
                'version': 1
            }
            supabase.table('terms_of_service').insert(new_tos).execute()
            
            # initiate a crawl for the terms of service
            url = site['url']
            payload = {'url': url}
            try:
                response = requests.post('http://localhost:3000/api/crawl', json=payload)
                if response.status_code == 200:
                    crawl_data = response.json()
                    site['last_crawled'] = crawl_data['last_crawled']
                    supabase.table('websites').update(site).eq('id', site['id']).execute()
                else:
                    print(f"Error processing last_crawled for {url}: {response.text}")
            except Exception as e:
                print(f"Error processing last_crawled for {url}: {e}")

def main():
    """
    Main function to run the cleanup task.
    """
    ensure_terms_of_service()

if __name__ == '__main__':
    main()