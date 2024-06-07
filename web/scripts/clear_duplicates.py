import os
from supabase import create_client, Client
from dotenv import load_dotenv

# load environment variables from .env.local file
load_dotenv(dotenv_path='.env.local')

# retrieve environment variables
SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

# check if the environment variables are loaded correctly
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and Key must be set in the .env.local file")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def delete_duplicate_websites():
    """
    Deletes duplicate website entries without an associated terms of service.
    """
    response = supabase.table('websites').select('url').execute()
    urls = [row['url'] for row in response.data]
    duplicate_urls = set([url for url in urls if urls.count(url) > 1])
    
    for url in duplicate_urls:
        # get all entries with the same URL
        entries_response = supabase.table('websites').select('*').execute()
        entries = entries_response.data
        
        # find the entries with and without associated terms of service
        entries_with_tos = [entry for entry in entries if entry.get('terms_of_service') is not None]
        entries_without_tos = [entry for entry in entries if entry.get('terms_of_service') is None]
        
        if entries_with_tos and entries_without_tos:
            # delete the entries without associated terms of service
            for entry in entries_without_tos:
                supabase.table('websites').delete().eq('id', entry['id']).execute()
                print(f"Deleted duplicate entry for {url} with ID {entry['id']} (no associated terms of service)")

def delete_websites_without_tos():
    """
    Deletes website entries that don't have an associated terms of service.
    """
    # get all website IDs
    websites_response = supabase.table('websites').select('id').execute()
    website_ids = [row['id'] for row in websites_response.data]
    
    # get all website IDs with associated terms of service
    tos_response = supabase.table('terms_of_service').select('website_id').execute()
    tos_website_ids = [row['website_id'] for row in tos_response.data]
    
    # find website IDs without associated terms of service
    website_ids_without_tos = set(website_ids) - set(tos_website_ids)
    
    for website_id in website_ids_without_tos:
        # delete the website entry
        supabase.table('websites').delete().eq('id', website_id).execute()
        print(f"Deleted website entry with ID {website_id} (no associated terms of service)")

def main():
    """
    Main function to run the cleanup tasks.
    """
    delete_duplicate_websites()
    delete_websites_without_tos()

if __name__ == '__main__':
    main()