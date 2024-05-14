import os
import requests
from datetime import datetime, timedelta
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
API_URL = 'https://tosbuddy.com/api/findTos'  # Use the production URL

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_outdated_tos():
    three_months_ago = datetime.now() - timedelta(days=90)
    response = supabase.from_('terms_of_service').select('*').lt('updated_at', three_months_ago.isoformat()).execute()
    return response.data if response.data else []

def fetch_existing_tos(website_id: int):
    response = supabase.from_('terms_of_service').select('*').eq('website_id', website_id).single().execute()
    return response.data if response.data else None

def update_tos(url: str, website_id: int, existing_tos: dict):
    try:
        response = requests.post(API_URL, json={'url': url})
        new_tos_content = response.json().get('content')

        if new_tos_content and new_tos_content != existing_tos['simplified_content']:
            new_version = existing_tos['version'] + 1 if existing_tos['version'] else 1
            update_data = {
                'simplified_content': new_tos_content,
                'updated_at': datetime.now().isoformat(),
                'version': new_version
            }
            supabase.from_('terms_of_service').update(update_data).eq('id', existing_tos['id']).execute()
            print(f'Updated ToS for {url} to version {new_version}')
        else:
            print(f'No changes detected for {url}, no update needed.')
    except Exception as e:
        print(f'Error updating ToS for {url}: {e}')

def main():
    outdated_tos = get_outdated_tos()
    if not outdated_tos:
        print('No outdated ToS found.')
        return

    for tos in outdated_tos:
        website_id = tos['website_id']
        if website_id:
            website_response = supabase.from_('websites').select('url').eq('id', website_id).single().execute()
            if website_response.data:
                url = website_response.data['url']
                existing_tos = fetch_existing_tos(website_id)
                if existing_tos:
                    update_tos(url, website_id, existing_tos)

if __name__ == '__main__':
    main()