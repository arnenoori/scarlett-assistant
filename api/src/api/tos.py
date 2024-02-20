import os
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from api.src.api import auth
import sqlalchemy
from api.src import database as db
import json
import random
from supabase import create_client, Client

router = APIRouter(
    prefix="/tos",
    tags=["tos"],
    dependencies=[Depends(auth.get_api_key)],
)

@router.post("/get_tos")
def get_tos(url: str):
    # shorten url to include only website name. Example: google
    url_name = url.split("//")[-1].split("/")[0].lower()

    supabase_url = os.getenv('SUPABASE_URL')
    supabase_key = os.getenv('SUPABASE_KEY')
    supabase: Client = create_client(supabase_url, supabase_key)

    # query the database first to check if url is already cached, if so return the path to the file in tos-bucket from 'simplified-content' column in terms_of_service table
    try:
        with db.engine.connect() as connection:
            result = connection.execute(f"SELECT * FROM terms_of_service WHERE url = '{url}'")
            row = result.fetchone()
            if row:
                website_id = row[0]
                result = connection.execute(f"SELECT simplified FROM terms_of_service WHERE website_id = '{website_id}'")
                row = result.fetchone()
                if row:
                    # get contents of the file from tos-bucket
                    try:
                        return supabase.storage.from_('tos-contents').download('./tos_docs_simplified/'+url_name+'simplified.txt').decode('utf-8')
                    except Exception as e:
                        print(f"Error: {e}")
                        return "Error"
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


