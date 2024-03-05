import os
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.src.api import auth
import sqlalchemy
from api.src import database as db
import json
import random
from supabase import create_client, Client
from sqlalchemy import create_engine, text
import sqlalchemy
from sqlalchemy.exc import SQLAlchemyError
import dotenv


router = APIRouter(
    prefix="/tos",
    tags=["tos"],
    dependencies=[Depends(auth.get_api_key)],
)

@router.post("/get_tos")
def get_tos(url: str):
    def database_connection_url():
        dotenv.load_dotenv()
        uri = os.getenv("POSTGRES_URI")
        return uri
    engine = create_engine(database_connection_url(), pool_pre_ping=True)

    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(supabase_url, supabase_key)
    
    # shorten url to include only website name. Example: google
    site_name = url.split("//")[-1].split("/")[0].lower().split(".")[1]
    print(site_name)

    # query the database first to check if url is already cached
    try:
        with db.engine.connect() as con:
            query = text("SELECT * FROM websites WHERE site_name = :site_name")
            result = con.execute(query, {"site_name": site_name})
            row = result.fetchone()
            if row:
                # get website_id 
                website_id = row[0]
                print(website_id)
                # Use website id to get file path to tos-contents bucket from terms_of_service table
                query = text("SELECT computed_tos_bucket_path FROM terms_of_service WHERE website_id = :website_id")
                result = con.execute(query, {"website_id": website_id})
                row = result.fetchone()
                if row:
                    file_path = row[0]
                    print(file_path)
                    # get contents of the file from tos-contents
                    simplified_tos = supabase.storage.from_('tos-bucket').download(file_path).decode('utf-8')
                    
                    # get tos score from database
                    # query = text("SELECT tos_score FROM websites WHERE site_name = :site_name")
                    # result = con.execute(query, {"site_name": site_name})
                    # row = result.fetchone()
                    # tos_score = row[0]
                    return {"simplified_tos": simplified_tos, "tos_score": 0}
                
    except Exception as e:
        print(f"Error: {e}")
        return "Error"
        

    # else if url is not cached, use the url to scrape the website and store the 'simplified_content' in the database, then return 'simplified_content'
    # use web scraping to scrape the website and get the terms of service
    # Feed contents to GPT and get simplified output
    # store simplified output in bucket
    # store path to bucket in database
    # return simplified output
    
    return {"message": "Unable to retrieve terms of service for this website at this time. Please try again later."}


