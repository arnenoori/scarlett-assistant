# go through the database and check if any websites have repeated site names. merge the two entries if they do
# check that a website is linked to a terms_of_service. if it has terms of service column missing then go crawl it
# merge together sites that have the same root domain but might have different extensin
# run websites that have NULL value for last_crawled 
# terms of service that have blank "{}" value for simplified_content - run summary endpoint again. if that doesnt work then recrawl for it

import os
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
from urllib.parse import urlparse

# load environment variables from .env.local file
load_dotenv(dotenv_path='.env.local')

# retrieve environment variables
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# check if the environment variables are loaded correctly
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the .env.local file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def merge_duplicate_sites():
    """
    Merges websites with the same site_name by combining their view_counter and keeping the latest updated_at.
    """
    response = supabase.table('websites').select('*').execute()
    websites = response.data
    site_map = {}
    
    for site in websites:
        site_name = site['site_name']
        if site_name in site_map:
            # merge logic: update the first entry and delete the duplicate
            existing_site = site_map[site_name]
            # assuming we merge view_counter and keep the latest updated_at
            existing_site['view_counter'] += site['view_counter']
            existing_site['updated_at'] = max(existing_site['updated_at'], site['updated_at'])
            supabase.table('websites').update(existing_site).eq('id', existing_site['id']).execute()
            
            # update terms_of_service entries to point to the existing site
            supabase.table('terms_of_service').update({'website_id': existing_site['id']}).eq('website_id', site['id']).execute()
            
            # delete the duplicate site
            supabase.table('websites').delete().eq('id', site['id']).execute()
        else:
            site_map[site_name] = site

def merge_sites_by_domain():
    """
    Merges websites with the same root domain by combining their view_counter and keeping the latest updated_at.
    """
    response = supabase.table('websites').select('*').execute()
    websites = response.data
    domain_map = {}
    
    for site in websites:
        parsed_url = urlparse(site['url'])
        root_domain = '.'.join(parsed_url.netloc.split('.')[-2:])
        
        if root_domain in domain_map:
            existing_site = domain_map[root_domain]
            existing_site['view_counter'] += site['view_counter']
            existing_site['updated_at'] = max(existing_site['updated_at'], site['updated_at'])
            supabase.table('websites').update(existing_site).eq('id', existing_site['id']).execute()
            
            # update terms_of_service entries to point to the existing site
            supabase.table('terms_of_service').update({'website_id': existing_site['id']}).eq('website_id', site['id']).execute()
            
            # delete the duplicate site
            supabase.table('websites').delete().eq('id', site['id']).execute()
        else:
            domain_map[root_domain] = site

def process_null_last_crawled():
    """
    Finds websites with NULL last_crawled and processes them by initiating a crawl.
    """
    response = supabase.table('websites').select('*').is_('last_crawled', None).execute()
    websites = response.data
    
    for site in websites:
        url = site['url']
        payload = {'url': url}
        try:
            response = requests.post('http://localhost:3000/api/crawl', json=payload)
            if response.status_code == 200:
                crawl_data = response.json()
                site['last_crawled'] = crawl_data['last_crawled']
                supabase.table('websites').update(site).eq('id', site['id']).execute()
        except Exception as e:
            print(f"Error processing last_crawled for {url}: {e}")

def reprocess_blank_tos():
    """
    Finds terms_of_service with blank simplified_content and reprocesses them using a summarization endpoint.
    """
    response = supabase.table('terms_of_service').select('*').eq('simplified_content', '{}').execute()
    tos_entries = response.data
    
    for tos in tos_entries:
        payload = {'content': tos['original_content']}
        try:
            response = requests.post('http://localhost:3000/api/summarization', json=payload)
            if response.status_code == 200:
                summary_data = response.json()
                tos['simplified_content'] = summary_data['simplified_content']
                supabase.table('terms_of_service').update(tos).eq('id', tos['id']).execute()
        except Exception as e:
            print(f"Error reprocessing ToS ID {tos['id']}: {e}")

def main():
    """
    Main function to run all cleanup tasks.
    """
    merge_duplicate_sites()
    merge_sites_by_domain()
    process_null_last_crawled()
    reprocess_blank_tos()

if __name__ == '__main__':
    main()