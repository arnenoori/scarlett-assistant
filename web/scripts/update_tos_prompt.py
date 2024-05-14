import os
import requests
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
SUMMARIZATION_API_URL = 'https://tosbuddy.com/api/summarization'  # Use the production URL

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_all_tos():
    response = supabase.from_('terms_of_service').select('*').execute()
    return response.data if response.data else []

def download_tos_file(file_path: str):
    response = supabase.storage().from_('terms_of_service').download(file_path)
    if response.error:
        print(f'Error downloading file {file_path}: {response.error.message}')
        return None
    return response.data.decode('utf-8')

def process_content(content: str):
    try:
        response = requests.post(SUMMARIZATION_API_URL, json={'content': content})
        response_json = response.json()
        return response_json.get('summary', {})
    except Exception as e:
        print(f'Error processing content: {e}')
        return {}

def update_tos_entry(tos_id: int, new_content: dict, new_version: int):
    update_data = {
        'simplified_content': new_content,
        'updated_at': datetime.now().isoformat(),
        'version': new_version
    }
    supabase.from_('terms_of_service').update(update_data).eq('id', tos_id).execute()

def main():
    all_tos = fetch_all_tos()
    if not all_tos:
        print('No terms of service entries found.')
        return

    for tos in all_tos:
        file_path = tos['file_path']
        existing_content = download_tos_file(file_path)
        if existing_content:
            new_content = process_content(existing_content)
            if new_content:
                new_version = tos['version'] + 1 if tos['version'] else 1
                update_tos_entry(tos['id'], new_content, new_version)
                print(f'Updated ToS entry {tos["id"]} to version {new_version}')

if __name__ == '__main__':
    main()