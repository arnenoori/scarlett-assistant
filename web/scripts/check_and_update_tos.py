import os
import csv
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

def clean_site_name(site_name: str):
    # remove text after -, :, | and .com
    delimiters = ['-', ':', '|', '.com']
    for delimiter in delimiters:
        if delimiter in site_name:
            parts = site_name.split(delimiter)
            # choose the side with fewer characters
            site_name = min(parts, key=len).strip()
    return site_name

def get_website_metadata(url: str):
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        title = soup.title.string if soup.title else ''
        description_tag = soup.find('meta', attrs={'name': 'description'})
        description = description_tag['content'].strip() if description_tag else ''
        return clean_site_name(title), description
    except Exception as e:
        print(f'Error extracting metadata from {url}: {e}')
        return '', ''

def read_svgs_from_csv(file_path: str):
    svgs = {}
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            svgs[row['url']] = row
            svgs[row['title']] = row
    return svgs

def populate_database():
    file_path = os.path.join(os.path.dirname(__file__), 'populate_initial_sites.txt')
    csv_path = os.path.join(os.path.dirname(__file__), 'logo_svgs.csv')
    
    websites = read_websites_from_file(file_path)
    svgs = read_svgs_from_csv(csv_path)
    
    # Remove duplicates from the list
    unique_websites = list(set(websites))
    if len(unique_websites) != len(websites):
        print("Duplicate URLs found and removed from populate_initial_sites.txt.")

    for url in unique_websites:
        parsed_url = urlparse(url)
        cleaned_url = f'{parsed_url.scheme}://{parsed_url.netloc}'
        
        # Check if the URL already exists in the database
        existing_entry = supabase \
            .from_('websites') \
            .select('id') \
            .eq('url', cleaned_url) \
            .execute()
        
        if existing_entry.data:
            print(f'{cleaned_url} already exists in the database. Skipping.')
        else:
            site_name, description = get_website_metadata(url)
            insert_data = {
                'url': cleaned_url,
                'site_name': site_name,
                'website_description': description,
                'last_crawled': 'now()',
                'view_counter': 0,
            }
            
            # Check for matching SVG content
            svg_data = svgs.get(cleaned_url) or svgs.get(site_name)
            if svg_data:
                insert_data['logo_svg'] = svg_data['svg_content']
                insert_data['category'] = svg_data['category']
            
            response = supabase.table('websites').insert(insert_data).execute()
            print(f'Inserted {cleaned_url} into Supabase')
        
        # Call the findTos API to crawl the ToS
        try:
            response = requests.post(API_URL, json={'url': cleaned_url})
            print(f'Processed {cleaned_url}: {response.json().get("message")}')
        except Exception as e:
            print(f'Error processing {cleaned_url}: {e}')

if __name__ == '__main__':
    populate_database()