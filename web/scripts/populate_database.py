import os
import csv
import requests
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from supabase import create_client, Client
from dotenv import load_dotenv
from openai import OpenAI
import json  # import json for safe parsing

load_dotenv()

SUPABASE_URL = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = os.getenv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
API_URL = 'http://localhost:3000/api/findTos'  # Adjust the URL if necessary

client = OpenAI(api_key=OPENAI_API_KEY)

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

def get_openai_category_and_description(metadata_description: str):
    prompt = f"""
You are an AI assistant that categorizes websites and writes SEO-friendly descriptions. Here is the metadata description of a website:

<metadata_description>
{metadata_description}
</metadata_description>

Please carefully analyze this metadata description. Based on your analysis, select the single most appropriate category for the website from the following list:

Categories: Technology, Business, Finance, Education, Entertainment, Social, Health, Lifestyle, News, Science, Arts, Sports, Government, Career, Personal Development, Hobbies, Religion, Parenting, Non-Profit, Automotive, Shopping, Pets,

Next, write a concise, SEO-friendly one-liner description encapsulating the key information about the website. The description should be engaging and include relevant keywords to help the website rank well in search results.

Please format your response in JSON with the following structure:

<json>
{{
  "category": "Selected category",
  "seo_description": "SEO-friendly one-liner description"
}}
</json>

Provide your response immediately, without any additional commentary before or after the JSON.
    """
    response = client.chat.completions.create(model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are an AI assistant."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=300,
    n=1,
    stop=None,
    temperature=0.7)
    try:
        result = response.choices[0].message.content.strip()
        print(f"OpenAI raw response: {result}")  # Debugging statement
        return json.loads(result)  # safely parse the JSON string to a dictionary
    except Exception as e:
        print(f"Error parsing OpenAI response: {e}")
        return {"category": "", "seo_description": ""}

def populate_database():
    file_path = os.path.join(os.path.dirname(__file__), 'populate_initial_sites.txt')
    csv_path = os.path.join(os.path.dirname(__file__), 'logo_svgs.csv')

    websites = read_websites_from_file(file_path)
    svgs = read_svgs_from_csv(csv_path)

    # remove duplicates from the list
    unique_websites = list(set(websites))
    num_duplicates = len(websites) - len(unique_websites)
    if num_duplicates > 0:
        print(f"{num_duplicates} duplicate URLs found and removed from populate_initial_sites.txt.")
    for url in unique_websites:
        title, description = get_website_metadata(url)
        openai_result = get_openai_category_and_description(description)

        data = {
            "url": url,
            "title": title,
            "website_description": description,  # updated key to match your table schema
            "category": openai_result.get("category", ""),
            "seo_description": openai_result.get("seo_description", ""),
            "svg": svgs.get(url, {}).get('svg', '')
        }

        try:
            supabase.table('websites').insert(data).execute()
            print(f"Inserted data for {url}")
        except Exception as e:
            print(f"Error inserting data for {url}: {e}")

if __name__ == "__main__":
    populate_database()