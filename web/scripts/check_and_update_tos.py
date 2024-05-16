import os
import requests
from datetime import datetime, timedelta
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUMMARIZATION_API_URL = 'https://tosbuddy.com/api/summarization'  # if local run: http://localhost:3000/api/summarization

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_outdated_tos():
    three_months_ago = datetime.now() - timedelta(days=90)
    response = supabase.from_('terms_of_service').select('*').lt('updated_at', three_months_ago.isoformat()).execute()
    return response.data if response.data else []

def fetch_existing_tos(website_id: int):
    response = supabase.from_('terms_of_service').select('*').eq('website_id', website_id).single().execute()
    return response.data if response.data else None

def update_tos_batch(tos_updates):
    try:
        response = requests.post(SUMMARIZATION_API_URL, json={'contents': tos_updates})
        batch_results = response.json()

        for result in batch_results:
            website_id = result['website_id']
            new_tos_content = result['content']
            existing_tos = fetch_existing_tos(website_id)

            if new_tos_content and new_tos_content != existing_tos['simplified_content']:
                new_version = existing_tos['version'] + 1 if existing_tos['version'] else 1
                update_data = {
                    'simplified_content': new_tos_content,
                    'updated_at': datetime.now().isoformat(),
                    'version': new_version
                }
                supabase.from_('terms_of_service').update(update_data).eq('id', existing_tos['id']).execute()
                print(f'Updated ToS for website ID {website_id} to version {new_version}')
            else:
                print(f'No changes detected for website ID {website_id}, no update needed.')
    except Exception as e:
        print(f'Error updating ToS batch: {e}')

def main():
    outdated_tos = get_outdated_tos()
    if not outdated_tos:
        print('No outdated ToS found.')
        return

    tos_updates = []
    for tos in outdated_tos:
        website_id = tos['website_id']
        if website_id:
            website_response = supabase.from_('websites').select('url').eq('id', website_id).single().execute()
            if website_response.data:
                url = website_response.data['url']
                tos_updates.append({'website_id': website_id, 'url': url})

    if tos_updates:
        update_tos_batch(tos_updates)

if __name__ == '__main__':
    main()