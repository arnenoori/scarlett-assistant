import os
import dotenv
from sqlalchemy import create_engine, text
import sqlalchemy
from sqlalchemy.exc import SQLAlchemyError

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
    {"url": "walmart.com", "site_name": "Walmart", "category": "E-commerce", "tos_url": "https://www.microsoft.com/en-us/servicesagreement"},
    {"url": "linkedin.com", "site_name": "LinkedIn", "category": "Professional Networking", "tos_url": "https://www.linkedin.com/legal/user-agreement"},
    {"url": "imdb.com", "site_name": "IMDb", "category": "Movies and TV", "tos_url": "https://www.imdb.com/conditions"},
    {"url": "openai.com", "site_name": "OpenAI", "category": "Artificial Intelligence", "tos_url": "https://openai.com/policies/terms-of-use"},
    {"url": "twitch.tv", "site_name": "Twitch", "category": "Live Streaming", "tos_url": "https://www.twitch.tv/p/en/legal/terms-of-service/"},
    {"url": "usps.com", "site_name": "United States Postal Service", "category": "Postal Service", "tos_url": "https://reg.usps.com/entreg/assets/html/informed-delivery.html"},
    {"url": "dailymail.co.uk", "site_name": "Daily Mail", "category": "News", "tos_url": "https://www.dailymail.co.uk/home/article-173687/Terms-conditions-use.html"},
    {"url": "netflix.com", "site_name": "Netflix", "category": "Streaming Service", "tos_url": "https://help.netflix.com/legal/termsofuse"},
    {"url": "msn.com", "site_name": "MSN", "category": "News and Services", "tos_url": "https://answers.msn.com/tou.aspx"},
    {"url": "etsy.com", "site_name": "Etsy", "category": "E-commerce", "tos_url": "https://www.etsy.com/legal/terms-of-use"},
    {"url": "instructure.com", "site_name": "Instructure", "category": "Education Technology", "tos_url": "https://www.instructure.com/policies/master-terms-conditions"},
    {"url": "paypal.com", "site_name": "PayPal", "category": "Payment Service", "tos_url": "https://www.paypal.com/us/legalhub/useragreement-full"},
    {"url": "bestbuy.com", "site_name": "Best Buy", "category": "E-commerce", "tos_url": "https://www.bestbuy.com/site/help-topics/terms-and-conditions/pcmcat204400050067.c?id=pcmcat204400050067"},
    {"url": "zoom.us", "site_name": "Zoom", "category": "Video Conferencing", "tos_url": "https://explore.zoom.us/en/terms/"},
    {"url": "nypost.com", "site_name": "New York Post", "category": "News", "tos_url": "https://nypost.com/terms/"},
    {"url": "accuweather.com", "site_name": "AccuWeather", "category": "Weather", "tos_url": "https://www.accuweather.com/en/legal#:~:text=Except%20as%20expressly%20provided%20herein,of%20AccuWeather%20or%20its%20Providers."},
    {"url": "pinterest.com", "site_name": "Pinterest", "category": "Social Networking", "tos_url": "https://policy.pinterest.com/en/terms-of-service"},
    {"url": "indeed.com", "site_name": "Indeed", "category": "Job Search", "tos_url": "https://www.indeed.com/legal"},
    {"url": "zillow.com", "site_name": "Zillow", "category": "Real Estate", "tos_url": "https://www.zillowgroup.com/terms-of-use/"},
    {"url": "apple.com", "site_name": "Apple", "category": "Technology", "tos_url": "https://www.apple.com/legal/internet-services/itunes/"},
    {"url": "homedepot.com", "site_name": "Home Depot", "category": "E-commerce", "tos_url": "https://www.homedepot.com/c/Terms_of_Use"},
    {"url": "discord.com", "site_name": "Discord", "category": "Social Networking", "tos_url": "https://discord.com/terms"},
    {"url": "bbc.com", "site_name": "BBC", "category": "News", "tos_url": "https://www.bbc.co.uk/usingthebbc/terms-of-use/"},
    {"url": "ign.com", "site_name": "IGN", "category": "Gaming News", "tos_url": "https://www.ign.com/wikis/ign-community-central/IGN-Share-Terms-and-conditions"},
    {"url": "ups.com", "site_name": "UPS", "category": "Postal Service", "tos_url": "https://www.ups.com/us/en/support/shipping-support/legal-terms-conditions/website-terms-of-use.page#:~:text=You%20agree%20to%20use%20the,any%20laws%2C%20rulings%20or%20regulations"},
    {"url": "target.com", "site_name": "Target", "category": "E-commerce", "tos_url": "https://www.target.com/c/terms-conditions/-/N-4sr7l"},
    {"url": "imgur.com", "site_name": "Imgur", "category": "Image Sharing", "tos_url": "https://imgur.com/tos"},
    {"url": "craigslist.org", "site_name": "Craigslist", "category": "Classifieds", "tos_url": "https://www.craigslist.org/about/terms.of.use/en"},
    {"url": "spotify.com", "site_name": "Spotify", "category": "Music Streaming", "tos_url": "https://www.spotify.com/us/legal/end-user-agreement/"},
    {"url": "fedex.com", "site_name": "FedEx", "category": "Postal Service", "tos_url": "https://www.fedex.com/en-us/terms-of-use.html"},
    {"url": "amazonaws.com", "site_name": "Amazon Web Services", "category": "Cloud Computing", "tos_url": ""},
    {"url": "gamespot.com", "site_name": "GameSpot", "category": "Gaming News", "tos_url": ""},
    {"url": "breitbart.com", "site_name": "Breitbart", "category": "News", "tos_url": ""},
    {"url": "patreon.com", "site_name": "Patreon", "category": "Crowdfunding", "tos_url": ""},
    {"url": "washingtonpost.com", "site_name": "The Washington Post", "category": "News", "tos_url": ""},
    {"url": "hulu.com", "site_name": "Hulu", "category": "Streaming Service", "tos_url": ""},
    {"url": "theguardian.com", "site_name": "The Guardian", "category": "News", "tos_url": ""},
    {"url": "costco.com", "site_name": "Costco", "category": "E-commerce", "tos_url": ""},
    {"url": "chase.com", "site_name": "Chase", "category": "Banking", "tos_url": ""},
    {"url": "steamcommunity.com", "site_name": "Steam Community", "category": "Gaming Community", "tos_url": ""},
    {"url": "outlook.com", "site_name": "Outlook", "category": "Email Service", "tos_url": ""},
    {"url": "slickdeals.net", "site_name": "Slickdeals", "category": "Coupons and Deals", "tos_url": ""},
    {"url": "roblox.com", "site_name": "Roblox", "category": "Online Gaming Platform", "tos_url": ""},
    {"url": "github.com", "site_name": "GitHub", "category": "Software Development", "tos_url": ""},
    {"url": "usatoday.com", "site_name": "USA Today", "category": "News", "tos_url": ""},
    {"url": "samsung.com", "site_name": "Samsung", "category": "Electronics", "tos_url": ""},
    {"url": "character.ai", "site_name": "Character.AI", "category": "Artificial Intelligence", "tos_url": ""},
    {"url": "capitalone.com", "site_name": "Capital One", "category": "Banking", "tos_url": ""},
    {"url": "temu.com", "site_name": "Temu", "category": "E-commerce", "tos_url": ""},
    {"url": "nextdoor.com", "site_name": "Nextdoor", "category": "Social Networking", "tos_url": ""},
    {"url": "lowes.com", "site_name": "Lowe's", "category": "Home Improvement", "tos_url": ""},
    {"url": "nih.gov", "site_name": "National Institutes of Health (NIH)", "category": "Health", "tos_url": ""},
    {"url": "yelp.com", "site_name": "Yelp", "category": "Business Reviews", "tos_url": ""},
    {"url": "foxbusiness.com", "site_name": "Fox Business", "category": "Business News", "tos_url": ""},
    {"url": "npr.org", "site_name": "NPR", "category": "Public Radio", "tos_url": ""},
    {"url": "canva.com", "site_name": "Canva", "category": "Graphic Design", "tos_url": ""},
    {"url": "xfinity.com", "site_name": "Xfinity", "category": "Telecommunications", "tos_url": ""},
    {"url": "quizlet.com", "site_name": "Quizlet", "category": "Education", "tos_url": ""},
    {"url": "steampowered.com", "site_name": "Steam", "category": "Digital Distribution", "tos_url": ""},
    {"url": "okta.com", "site_name": "Okta", "category": "Identity Management", "tos_url": ""},
    {"url": "nbcnews.com", "site_name": "NBC News", "category": "News", "tos_url": ""},
    {"url": "cnbc.com", "site_name": "CNBC", "category": "Business News", "tos_url": ""},
    {"url": "apnews.com", "site_name": "Associated Press News", "category": "News Agency", "tos_url": ""},
    {"url": "adobe.com", "site_name": "Adobe", "category": "Software", "tos_url": ""},
    {"url": "cvs.com", "site_name": "CVS", "category": "Pharmacy", "tos_url": ""},
    {"url": "wordpress.com", "site_name": "WordPress", "category": "Web Publishing", "tos_url": ""},
    {"url": "whatsapp.com", "site_name": "WhatsApp", "category": "Messaging", "tos_url": ""}
]

def database_connection_url():
    dotenv.load_dotenv()
    uri = os.getenv("POSTGRES_URI")
    print(uri)
    return uri

engine = create_engine(database_connection_url(), pool_pre_ping=True)

# testing out the connection with a simple query
try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        print("Tables in the 'public' schema:")
        for row in result:
            print(row[0])
except Exception as e:
    print("Database connection failed:", e)

'''
-- Websites Table
CREATE TABLE websites (
    website_id SERIAL PRIMARY KEY,
    url VARCHAR(255) UNIQUE NOT NULL,
    site_name VARCHAR(255),
    category VARCHAR(255), -- categorizing the website (e.g., e-commerce, social media)
    last_crawled TIMESTAMP WITH TIME ZONE
);

-- Terms of Service Table
CREATE TABLE terms_of_service (
    tos_id SERIAL PRIMARY KEY,
    website_id INT REFERENCES websites(website_id),
    content TEXT NOT NULL,
    simplified_content TEXT NOT NULL,
    version_identifier VARCHAR(255), 
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tos_url VARCHAR(255)
);
'''

# Insert data into the websites and terms_of_service tables
for website in websites_info:
    try:
        with engine.connect() as connection:
            with connection.begin(): 
                insert_website = """
                INSERT INTO websites (url, site_name, category) 
                VALUES (:url, :site_name, :category)
                ON CONFLICT (url) DO UPDATE 
                SET site_name = EXCLUDED.site_name,
                    category = EXCLUDED.category
                RETURNING website_id;
                """
                website_id_result = connection.execute(text(insert_website), {"url": website["url"], "site_name": website["site_name"], "category": website["category"]})
                website_id = website_id_result.fetchone()[0]
                print(f"Inserted website {website['site_name']} with ID {website_id} into websites table")

                website_tos_text_file = f"./tos_docs/{website['site_name']}.txt"
                if os.path.exists(website_tos_text_file):
                    with open(website_tos_text_file, "r") as file:
                        tos_content = file.read()
                    insert_tos = """
                    INSERT INTO terms_of_service (website_id, content, simplified_content, tos_url) 
                    VALUES (:website_id, :content, :simplified_content, :tos_url);
                    """
                    connection.execute(text(insert_tos), {"website_id": website_id, "content": tos_content, "simplified_content": "", "tos_url": website["tos_url"]})
                    print(f"Inserted terms of service for {website['site_name']} into terms_of_service table")
                else:
                    print(f"File not found: {website_tos_text_file}")
                
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