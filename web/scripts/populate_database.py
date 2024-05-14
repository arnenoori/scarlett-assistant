import os
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
API_URL = 'http://localhost:3000/api/findTos'  # Adjust the URL if necessary

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def read_websites_from_file(file_path: str):
    with open(file_path, 'r') as file:
        return [line.strip() for line in file if line.strip()]

def get_website_metadata(url: str):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.title.string if soup.title else ''
        description_tag = soup.find('meta', attrs={'name': 'description'})
        description = description_tag['content'].strip() if description_tag else ''
        return title, description
    except Exception as e:
        print(f'Error extracting metadata from {url}: {e}')
        return '', ''

def populate_database():
    file_path = os.path.join(os.path.dirname(__file__), 'populate_initial_sites.txt')
    websites = read_websites_from_file(file_path)

    for url in websites:
        parsed_url = urlparse(url)
        cleaned_url = f'{parsed_url.scheme}://{parsed_url.netloc}'

        # Check if the URL already exists in the database
        existing_entry = supabase \
            .from_('websites') \
            .select('id') \
            .eq('url', cleaned_url) \
            .maybe_single() \
            .execute()

        if existing_entry and existing_entry.data:
            print(f'{cleaned_url} already exists in the database. Skipping.')
            continue

        site_name, description = get_website_metadata(url)

        insert_data = {
            'url': cleaned_url,
            'site_name': site_name,
            'website_description': description,
            'last_crawled': 'now()',
            'view_counter': 0,
        }

        response = supabase.table('websites').insert(insert_data).execute()
        if response.data is None or response.status_code not in (200, 201):
            print(f'Error inserting {cleaned_url} into Supabase: {response}')
        else:
            print(f'Inserted {cleaned_url} into Supabase')

            # Call the findTos API to crawl the ToS
            try:
                response = requests.post(API_URL, json={'url': cleaned_url})
                print(f'Processed {cleaned_url}: {response.json().get("message")}')
            except Exception as e:
                print(f'Error processing {cleaned_url}: {e}')

if __name__ == '__main__':
    populate_database()