import os
from io import BytesIO
import dotenv
from sqlalchemy import create_engine, text
import sqlalchemy
from sqlalchemy.exc import SQLAlchemyError
from supabase import create_client, Client
from openai import OpenAI

def find_and_fetch_tos(url):
    # 1. Crawl the website to find the ToS link (this step is highly variable and depends on the website structure).
    tos_url = crawl_for_tos_link(url)  # You need to implement this function.

    # 2. Fetch the ToS text from the tos_url.
    tos_text = fetch_tos_text(tos_url)  # Implement this function to fetch and parse the ToS page.

    return tos_text



# Update websites and terms_of_service tables
if __name__ == "__main__":
    def database_connection_url():
        dotenv.load_dotenv()
        uri = os.getenv("POSTGRES_URI")
        return uri

    engine = create_engine(database_connection_url(), pool_pre_ping=True)


    for website in websites_info:
        try:
            with engine.connect() as connection:
                with connection.begin(): 
                    insert_website = """
                    INSERT INTO websites (url, site_name, category, last_crawled) 
                    VALUES (:url, :site_name, :category, NOW())
                    ON CONFLICT (url) DO UPDATE 
                    SET site_name = EXCLUDED.site_name,
                        category = EXCLUDED.category,
                        last_crawled = NOW()
                    RETURNING website_id;
                    """
                    website_id_result = connection.execute(text(insert_website), {"url": website["url"], "site_name": website["site_name"].lower(), "category": website["category"]})
                    website_id = website_id_result.fetchone()[0]

                    insert_tos_table = """
                    INSERT INTO terms_of_service (website_id, tos_bucket_path, computed_tos_bucket_path, tos_url, last_updated) 
                    VALUES (:website_id, :tos_bucket_path, :computed_tos_bucket_path, :tos_url, NOW());  """

                    tos_bucket_path = "./tos_docs/" + website["site_name"].lower() + ".txt"
                    computed_bucket_path = "./tos_docs_simplified/" + website["site_name"].lower() + "_simplified.txt"
                    connection.execute(text(insert_tos_table), {"website_id": website_id, "tos_bucket_path": tos_bucket_path, "computed_tos_bucket_path": computed_bucket_path, "tos_url": website["tos_url"]})
                    
        except SQLAlchemyError as e:
            print(f"Database operation failed for {website['site_name']}: {e}")


    # Retrieve data from the websites and terms_of_service tables
    try:
        with engine.connect() as connection:
            select_websites = """
            SELECT * FROM websites
            """
            websites = connection.execute(sqlalchemy.text(select_websites))
            for website in websites:
                print(website)
            
            select_tos = """
            SELECT * FROM terms_of_service
            """
            tos = connection.execute(sqlalchemy.text(select_tos))
            for tos in tos:
                print(tos)
    except SQLAlchemyError as e:
        print("Database connection failed:", e)

'''

# Upload TOS document to Supabase Storage
'''
if __name__ == "__main__":
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    supabase: Client = create_client(url, key)

    # test connection
    res = supabase.storage.from_('tos-bucket').list()
    print(res)

    # Upload TOS document to Supabase Storage
    def upload_tos_to_supbase_bucket(file_path, bucket_name, client: Client) -> str:
        storage_path = f"tos_docs/{file_path.split('/')[-1]}"
        try:
            with open(file_path, "rb") as f:
                upload_response = client.storage.from_(bucket_name).upload(storage_path, f)

        except Exception as e:
            print(f"Exception during file upload: {e}")
            
        return "OK"

    # Get the contents of a file from Supabase Storage
    def get_file_contents(client: Client, bucket_name: str, bucket_file_path: str) -> str:
        try:
            return client.storage.from_(bucket_name).download(bucket_file_path).decode('utf-8')
        except Exception as e:
            print(f"Error: {e}")
            return "Error"    

    for website in websites_info:
        # Upload to Supabase storage tos-bucket
        file_path = f"./tos_docs/{website['site_name']}.txt"
        upload_result = upload_tos_to_supbase_bucket(file_path, 'tos-bucket', supabase)

        if upload_result:
            # Insert the URL for the Supabase storage location in the terms_of_service table
            try:
                with engine.connect() as connection:
                    with connection.begin():
                        update_tos = """
                        UPDATE terms_of_service 
                        SET tos_url = :tos_url 
                        WHERE website_id = (SELECT website_id FROM websites WHERE url = :url);
                        """
                        connection.execute(text(update_tos), {"tos_url": upload_result, "url": website["url"]})
                        print(f"Updated TOS URL for {website['site_name']}")
            except SQLAlchemyError as e:
                print(f"Database operation failed for {website['site_name']}: {e}")

            relative_path = 'tos_docs/' + website['site_name'] + '.txt'

            print('\n\n')
            print(relative_path)

            tos_contents = get_file_contents(supabase, 'tos-bucket', relative_path)
            print(tos_contents[:100])
        else:
            print(f"Failed to upload {website['site_name']} document.")
'''

'''
# Upload simplified TOS documen to Supabase Storage - TEST
if __name__ == '__main__':
    from io import StringIO
    
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    supabase: Client = create_client(url, key)

    # test connection
    res = supabase.storage.from_('tos-bucket').list()
    print(res)
    
    # Get the contents of a file from Supabase Storage - TEST for AWS
    try:
        AWS_path = 'tos_docs/AWS.txt'
        AWS_contents = supabase.storage.from_('tos-bucket').download(AWS_path).decode('utf-8')
    except Exception as e:
        print(f"Error: {e}")
        AWS_contents = "Error"

    # Send the TOS document to OpenAI to get the simplified output
    prompt: str = "Summarize this document below in a short 3-5 paragraph. Warns me of any potential dangers:\n\n" + AWS_contents

    openai_client = OpenAI()

    completion = openai_client.chat.completions.create(
        model="gpt-4-0125-preview",
        messages =[{"role": "user", "content": prompt}]
    )

    simplified_content = completion.choices[0].message.content
    print(simplified_content)

    # Upload simplified TOS document to Supabase Storage in the tos-contents bucket, in the ./tos_docs_simplified/ directory
    storage_path = f"tos_docs_simplified/AWS_simplified.txt"

    # Use StringIO as an in-memory text buffer
    file_buffer = StringIO(simplified_content)

    try:
        # Convert StringIO buffer to bytes
        file_bytes = file_buffer.getvalue().encode('utf-8')
        
        # Upload directly from memory
        upload_response = supabase.storage.from_('tos-bucket').upload(storage_path, file_bytes)
        print("Successfully uploaded", upload_response)
    except Exception as e:
        print(f"Exception during file upload: {e}")

    file_buffer.close()