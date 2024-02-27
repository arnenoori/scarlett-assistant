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



websites_info = [
    {"url": "google.com", "site_name": "Google", "category": "Search Engine", "tos_url": "https://policies.google.com/terms?hl=en-US"},
    {"url": "youtube.com", "site_name": "YouTube", "category": "Video Sharing", "tos_url": "https://www.youtube.com/static?template=terms"},
    {"url": "reddit.com", "site_name": "Reddit", "category": "Social News", "tos_url": "https://www.redditinc.com/policies/user-agreement-september-25-2023"},
    {"url": "amazon.com", "site_name": "Amazon", "category": "E-commerce", "tos_url": "https://www.amazon.com/gp/help/customer/display.html?nodeId=202140280"},
    {"url": "facebook.com", "site_name": "Facebook", "category": "Social Networking", "tos_url": "https://www.facebook.com/legal/terms"},
    {"url": "duckduckgo.com", "site_name": "DuckDuckGo", "category": "Search Engine", "tos_url": "https://duckduckgo.com/terms"},
    {"url": "yahoo.com", "site_name": "Yahoo", "category": "Web Services", "tos_url": "https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html"},
    {"url": "wikipedia.org", "site_name": "Wikipedia", "category": "Online Encyclopedia", "tos_url": "https://en.wikipedia.org/wiki/Terms_of_service"},
    {"url": "twitter.com", "site_name": "Twitter", "category": "Social Networking", "tos_url": "https://twitter.com/en/tos"},
    {"url": "instagram.com", "site_name": "Instagram", "category": "Social Networking", "tos_url": "https://help.instagram.com/581066165581870"},
    {"url": "bing.com", "site_name": "Bing", "category": "Search Engine", "tos_url": "https://www.bing.com/new/termsofuse"},
    {"url": "fandom.com", "site_name": "Fandom", "category": "Fan Community", "tos_url": "https://www.fandom.com/terms-of-use"},
    {"url": "weather.com", "site_name": "Weather", "category": "Weather", "tos_url": "https://weather.com/legal#"},
    {"url": "cnn.com", "site_name": "CNN", "category": "News", "tos_url": "https://www.cnn.com/2014/01/17/cnn-info/interactive-legal/index.html"},
    {"url": "espn.com", "site_name": "ESPN", "category": "Sports", "tos_url": "https://www.espn.com/mobile/aware/terms.pdf"},
    {"url": "tiktok.com", "site_name": "TikTok", "category": "Social Networking", "tos_url": "https://www.tiktok.com/legal/page/us/terms-of-service/en"},
    {"url": "nytimes.com", "site_name": "NYT", "category": "News", "tos_url": "https://help.nytimes.com/hc/en-us/articles/115014893428-Terms-of-Service"},
    {"url": "foxnews.com", "site_name": "FoxNews", "category": "News", "tos_url": "https://www.foxnews.com/terms-of-use"},
    {"url": "ebay.com", "site_name": "eBay", "category": "E-commerce", "tos_url": "https://www.ebay.com/help/policies/member-behaviour-policies/user-agreement?id=4259"},
    {"url": "quora.com", "site_name": "Quora", "category": "Question and Answer", "tos_url": "https://www.quora.com/about/tos"},
    {"url": "microsoft.com", "site_name": "Microsoft", "category": "Web Services", "tos_url": "https://www.microsoft.com/en-us/servicesagreement"},
    {"url": "walmart.com", "site_name": "Walmart", "category": "E-commerce", "tos_url": "https://www.walmart.com/help/article/walmart-com-terms-of-use/3b75080af40340d6bbd596f116fae5a0"},
    {"url": "linkedin.com", "site_name": "LinkedIn", "category": "Professional Networking", "tos_url": "https://www.linkedin.com/legal/user-agreement"},
    {"url": "imdb.com", "site_name": "IMDb", "category": "Movies and TV", "tos_url": "https://www.imdb.com/conditions"},
    {"url": "openai.com", "site_name": "OpenAI", "category": "Artificial Intelligence", "tos_url": "https://openai.com/policies/terms-of-use"},
    {"url": "twitch.tv", "site_name": "Twitch", "category": "Live Streaming", "tos_url": "https://www.twitch.tv/p/en/legal/terms-of-service/"},
    {"url": "usps.com", "site_name": "USPS", "category": "Postal Service", "tos_url": "https://reg.usps.com/entreg/assets/html/informed-delivery.html"},
    {"url": "dailymail.co.uk", "site_name": "DailyMail", "category": "News", "tos_url": "https://www.dailymail.co.uk/home/article-173687/Terms-conditions-use.html"},
    {"url": "netflix.com", "site_name": "Netflix", "category": "Streaming Service", "tos_url": "https://help.netflix.com/legal/termsofuse"},
    {"url": "msn.com", "site_name": "MSN", "category": "News and Services", "tos_url": "https://answers.msn.com/tou.aspx"},
    {"url": "etsy.com", "site_name": "Etsy", "category": "E-commerce", "tos_url": "https://www.etsy.com/legal/terms-of-use"},
    {"url": "instructure.com", "site_name": "Instructure", "category": "Education Technology", "tos_url": "https://www.instructure.com/policies/master-terms-conditions"},
    {"url": "paypal.com", "site_name": "PayPal", "category": "Payment Service", "tos_url": "https://www.paypal.com/us/legalhub/useragreement-full"},
    {"url": "bestbuy.com", "site_name": "BestBuy", "category": "E-commerce", "tos_url": "https://www.bestbuy.com/site/help-topics/terms-and-conditions/pcmcat204400050067.c?id=pcmcat204400050067"},
    {"url": "zoom.us", "site_name": "Zoom", "category": "Video Conferencing", "tos_url": "https://explore.zoom.us/en/terms/"},
    {"url": "nypost.com", "site_name": "NYPost", "category": "News", "tos_url": "https://nypost.com/terms/"},
    {"url": "accuweather.com", "site_name": "AccuWeather", "category": "Weather", "tos_url": "https://www.accuweather.com/en/legal#:~:text=Except%20as%20expressly%20provided%20herein,of%20AccuWeather%20or%20its%20Providers."},
    {"url": "pinterest.com", "site_name": "Pinterest", "category": "Social Networking", "tos_url": "https://policy.pinterest.com/en/terms-of-service"},
    {"url": "indeed.com", "site_name": "Indeed", "category": "Job Search", "tos_url": "https://www.indeed.com/legal"},
    {"url": "zillow.com", "site_name": "Zillow", "category": "Real Estate", "tos_url": "https://www.zillowgroup.com/terms-of-use/"},
    {"url": "apple.com", "site_name": "Apple", "category": "Technology", "tos_url": "https://www.apple.com/legal/internet-services/itunes/"},
    {"url": "homedepot.com", "site_name": "HomeDepot", "category": "E-commerce", "tos_url": "https://www.homedepot.com/c/Terms_of_Use"},
    {"url": "discord.com", "site_name": "Discord", "category": "Social Networking", "tos_url": "https://discord.com/terms"},
    {"url": "bbc.com", "site_name": "BBC", "category": "News", "tos_url": "https://www.bbc.co.uk/usingthebbc/terms-of-use/"},
    {"url": "ign.com", "site_name": "IGN", "category": "Gaming News", "tos_url": "https://www.ign.com/wikis/ign-community-central/IGN-Share-Terms-and-conditions"},
    {"url": "ups.com", "site_name": "UPS", "category": "Postal Service", "tos_url": "https://www.ups.com/us/en/support/shipping-support/legal-terms-conditions/website-terms-of-use.page#:~:text=You%20agree%20to%20use%20the,any%20laws%2C%20rulings%20or%20regulations"},
    {"url": "target.com", "site_name": "Target", "category": "E-commerce", "tos_url": "https://www.target.com/c/terms-conditions/-/N-4sr7l"},
    {"url": "imgur.com", "site_name": "Imgur", "category": "Image Sharing", "tos_url": "https://imgur.com/tos"},
    {"url": "craigslist.org", "site_name": "Craigslist", "category": "Classifieds", "tos_url": "https://www.craigslist.org/about/terms.of.use/en"},
    {"url": "spotify.com", "site_name": "Spotify", "category": "Music Streaming", "tos_url": "https://www.spotify.com/us/legal/end-user-agreement/"},
    {"url": "fedex.com", "site_name": "FedEx", "category": "Postal Service", "tos_url": "https://www.fedex.com/en-us/terms-of-use.html"},
    {"url": "amazonaws.com", "site_name": "AWS", "category": "Cloud Computing", "tos_url": "https://aws.amazon.com/service-terms/"},
    {"url": "gamespot.com", "site_name": "GameSpot", "category": "Gaming News", "tos_url": "https://www.clubrytariy.com/terms-of-use/index.html"},
    {"url": "breitbart.com", "site_name": "Breitbart", "category": "News", "tos_url": "https://www.breitbart.com/terms-of-use/"},
    {"url": "patreon.com", "site_name": "Patreon", "category": "Crowdfunding", "tos_url": "https://www.patreon.com/policy/legal"},
    {"url": "washingtonpost.com", "site_name": "WashingtonPost", "category": "News", "tos_url": "https://www.washingtonpost.com/terms-of-service/"},
    {"url": "hulu.com", "site_name": "Hulu", "category": "Streaming Service", "tos_url": "https://www.hulu.com/subscriber_agreement"},
    {"url": "theguardian.com", "site_name": "TheGuardian", "category": "News", "tos_url": "https://www.theguardian.com/help/terms-of-service"},
    {"url": "costco.com", "site_name": "Costco", "category": "E-commerce", "tos_url": "https://www.costco.com/terms-and-conditions-of-use.html"},
    {"url": "chase.com", "site_name": "Chase", "category": "Banking", "tos_url": "https://www.chase.com/digital/resources/terms-of-use"},
    {"url": "steamcommunity.com", "site_name": "Steam", "category": "Gaming Community", "tos_url": "https://store.steampowered.com/eula/471710_eula_0"},
    {"url": "slickdeals.net", "site_name": "Slickdeals", "category": "Coupons and Deals", "tos_url": "http://corp-site.slickdeals.net/content-list-slickdeals-terms-of-service/"},
    {"url": "roblox.com", "site_name": "Roblox", "category": "Online Gaming Platform", "tos_url": "https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use"},
    {"url": "github.com", "site_name": "GitHub", "category": "Software Development", "tos_url": "https://docs.github.com/en/site-policy/github-terms/github-terms-of-service"},
    {"url": "usatoday.com", "site_name": "USAToday", "category": "News", "tos_url": "https://cm.usatoday.com/terms/"},
    {"url": "samsung.com", "site_name": "Samsung", "category": "Electronics", "tos_url": "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwiNrdP62pSEAxUnOUQIHUgJCq0QFnoECAYQAQ&url=https%3A%2F%2Fwww.samsung.com%2Fus%2Fapps%2Fsamsung-members%2Fterms-of-service%2F&usg=AOvVaw0jWRlY4BpLQHz4Yf0cbwSS&opi=89978449"},
    {"url": "character.ai", "site_name": "CharacterAI", "category": "Artificial Intelligence", "tos_url": "https://beta.character.ai/tos"},
    {"url": "capitalone.com", "site_name": "CapitalOne", "category": "Banking", "tos_url": "https://www.capitalone.com/digital/terms-conditions/"},
    {"url": "temu.com", "site_name": "Temu", "category": "E-commerce", "tos_url": "https://www.temu.com/terms-of-use.html"},
    {"url": "nextdoor.com", "site_name": "Nextdoor", "category": "Social Networking", "tos_url": "https://help.nextdoor.com/s/article/Member-Agreement-2024?language=en_US"},
    {"url": "lowes.com", "site_name": "Lowes", "category": "Home Improvement", "tos_url": "https://www.lowes.com/l/about/terms-and-conditions-of-use"},
    {"url": "nih.gov", "site_name": "NIH", "category": "Health", "tos_url": "https://www.nih.gov/web-policies-notices"},
    {"url": "yelp.com", "site_name": "Yelp", "category": "Business Reviews", "tos_url": "https://terms.yelp.com/tos/en_us/20200101_en_us/"},
    {"url": "foxbusiness.com", "site_name": "FoxBusiness", "category": "Business News", "tos_url": "https://www.foxbusiness.com/terms-of-use#"},
    {"url": "npr.org", "site_name": "NPR", "category": "Public Radio", "tos_url": "https://www.npr.org/about-npr/179876898/terms-of-use"},
    {"url": "canva.com", "site_name": "Canva", "category": "Graphic Design", "tos_url": "https://www.canva.com/policies/terms-of-use/"},
    {"url": "xfinity.com", "site_name": "Xfinity", "category": "Telecommunications", "tos_url": "https://www.xfinity.com/terms/web"},
    {"url": "quizlet.com", "site_name": "Quizlet", "category": "Education", "tos_url": "https://quizlet.com/tos"},
    {"url": "okta.com", "site_name": "Okta", "category": "Identity Management", "tos_url": "https://www.okta.com/terms-of-service/"},
    {"url": "nbcnews.com", "site_name": "NBC", "category": "News", "tos_url": "https://www.nbcuniversal.com/terms#:~:text=NBCUniversal%20and%20you%20agree%20that,transactions%20or%20relationships%20related%20to"},
    {"url": "cnbc.com", "site_name": "CNBC", "category": "Business News", "tos_url": "https://www.cnbc.com/nbcuniversal-terms-of-service/"},
    {"url": "apnews.com", "site_name": "AssociatedPressNews", "category": "News Agency", "tos_url": "https://apnews.com/termsofservice"},
    {"url": "adobe.com", "site_name": "Adobe", "category": "Software", "tos_url": "https://www.adobe.com/legal/terms.html"},
    {"url": "cvs.com", "site_name": "CVS", "category": "Pharmacy", "tos_url": "https://www.cvs.com/retail/help/terms_of_use"},
    {"url": "wordpress.com", "site_name": "WordPress", "category": "Web Publishing", "tos_url": "https://wordpress.com/tos/"},
    {"url": "whatsapp.com", "site_name": "WhatsApp", "category": "Messaging", "tos_url": "https://www.whatsapp.com/legal/terms-of-service"}
]


'''
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

                    # Modify these lines to use website_id for file paths
                    tos_bucket_path = f"./tos_docs/{website_id}.txt"
                    computed_bucket_path = f"./tos_docs_simplified/{website_id}_simplified.txt"

                    insert_tos_table = """
                    INSERT INTO terms_of_service (website_id, tos_bucket_path, computed_tos_bucket_path, tos_url, last_updated) 
                    VALUES (:website_id, :tos_bucket_path, :computed_tos_bucket_path, :tos_url, NOW());
                    """
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

'''

# Upload TOS document to Supabase Storage
'''

if __name__ == "__main__":
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(url, key)

    engine = create_engine()


    # test connection
    res = supabase.storage.from_('tos-bucket').list()
    print(res)

    # Upload TOS document to Supabase Storage
    def upload_tos_to_supbase_bucket(file_path, bucket_name, client: Client, website_id) -> str:
        storage_path = f"tos_docs/{website_id}.txt"
        try:
            with open(file_path, "rb") as f:
                upload_response = client.storage.from_(bucket_name).upload(storage_path, f)
        except Exception as e:
            print(f"Exception during file upload: {e}")
            return "Error"  # Return "Error" instead of "OK" on failure to accurately reflect status
        return "OK"


    # Get the contents of a file from Supabase Storage
    def get_file_contents(client: Client, bucket_name: str, bucket_file_path: str) -> str:
        try:
            return client.storage.from_(bucket_name).download(bucket_file_path).decode('utf-8')
        except Exception as e:
            print(f"Error: {e}")
            return "Error"    

    for website in websites_info:
        try:
            with engine.connect() as connection:
                # Assuming website_id is correctly retrieved from the database as shown
                website_id_result = connection.execute(
                    text("SELECT website_id FROM websites WHERE url = :url"),
                    {"url": website["url"]}
                )
                website_id = website_id_result.fetchone()[0]

                # Local file path uses the company name; you need the mapping here if company name is still used
                company_name = website['site_name'].lower()  # Example to get the company name
                local_file_path = f"./api/tos_docs/{company_name}.txt"  # Path based on the company name

                # Upload process
                upload_result = upload_tos_to_supbase_bucket(local_file_path, 'tos-bucket', supabase, website_id)

                if upload_result == "OK":
                    supabase_path = f"tos_docs/{website_id}.txt"  # This should be derived from upload_response

                    # Update the terms_of_service table with the new URL/path
                    update_tos = """
                    UPDATE terms_of_service 
                    SET tos_url = :tos_url 
                    WHERE website_id = :website_id;
                    """
                    connection.execute(text(update_tos), {"tos_url": supabase_path, "website_id": website_id})

                    print(f"Updated TOS URL for {website['site_name']}")
        except SQLAlchemyError as e:
            print(f"Database operation failed for {website['site_name']}: {e}")
            



'''
if __name__ == '__main__':
    from io import StringIO

    # Assuming you have a way to loop over websites and their ids
    for website in websites_info:
        try:
            with engine.connect() as connection:
                website_id_result = connection.execute(
                    text("SELECT website_id FROM websites WHERE url = :url"),
                    {"url": website["url"]}
                )
                website_id = website_id_result.fetchone()[0]
                
                original_path = f"tos_docs/{website_id}.txt"
                simplified_path = f"tos_docs_simplified/{website_id}_simplified.txt"

                # Download original TOS content
                try:
                    tos_contents = supabase.storage.from_('tos-bucket').download(original_path).decode('utf-8')
                except Exception as e:
                    print(f"Error downloading original TOS for {website['url']}: {e}")
                    continue  # Skip to the next website if there's an issue

                # Process the TOS content with OpenAI (or any other logic you have)
                prompt = f"Summarize this document in a short 3-5 paragraph. Warns me of any potential dangers:\n\n{tos_contents}"
                simplified_content = "Your simplified content here"  # Result from processing
                
                # Upload simplified content
                file_buffer = StringIO(simplified_content)
                file_bytes = file_buffer.getvalue().encode('utf-8')
                try:
                    upload_response = supabase.storage.from_('tos-bucket').upload(simplified_path, file_bytes)
                    print(f"Successfully uploaded simplified TOS for {website_id}")
                except Exception as e:
                    print(f"Exception during file upload for {website_id}: {e}")
                finally:
                    file_buffer.close()
        except SQLAlchemyError as e:
            print(f"Database operation failed for {website['site_name']}: {e}")
'''


# Upload TOS document to Supabase Storage

